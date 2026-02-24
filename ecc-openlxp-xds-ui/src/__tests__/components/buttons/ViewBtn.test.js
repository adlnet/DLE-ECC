'use strict';

import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { useAuth } from '@/contexts/AuthContext';
import ViewBtn from "@/components/buttons/ViewBtn";
import courseData from '@/__mocks__/data/course.data';
import xAPIMapper from "@/utils/xapi/xAPIMapper";

// mock auth
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const renderer = (data = courseData) => {
  useAuth.mockImplementation(() => {
    return {
      user: { user: { email: 'test@email.com' } },
    };
  });

  return render(
    <MemoryRouterProvider url='/'>
      <ViewBtn id={data.meta.id} courseTitle={data.courseTitle} courseDescription={data.courseDescription} />
    </MemoryRouterProvider>
  );
};

describe('ShareBtn', () => {
  it('has an id', () => {
    const { getByRole } = renderer();

    expect(getByRole('button').id).not.toBeNull();
  });

  it('send xAPI statement when course is clicked', () => {
    const { getByRole } = renderer();

    const spy = jest.spyOn(xAPIMapper, 'sendStatement')
      .mockImplementation(() => Promise.resolve({})
      );

    fireEvent.click(getByRole('button'));

    expect(spy).toHaveBeenCalled();
  })
});
