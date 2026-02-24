'use strict';

import DefaultLayout from '@/components/layouts/DefaultLayout';

export default function AboutECC() {
  return (
    <DefaultLayout>
      <div className='mt-10 pb-20'>
        <h1 className='pb-4 border-b mb-8 text-3xl font-semibold'>
          About Enterprise Course Catalog (ECC)
        </h1>
        <h2 className='text-xl font-semibold'>The Challenge</h2>
        <p className='mb-2'>
          One major benefit of a Defense-wide learning ecosystem is the
          availability and accessibility of instructional resources from across
          the agency. However, with hundreds of DoD organizations currently
          using a wide variety of methods to describe and publish these
          resources, there are now thousands of proprietary and disconnected
          catalog capabilities across the enterprise, many of them hard to find
          or even know they exist.
        </p>
        <p className='pb-4 mb-2'>
          Existing course catalogs are not designed to easily transfer data
          about learning activities between the different DoD systems. Catalogs
          integrated into proprietary platforms use pre-determined,
          point-to-point connections to transfer data between systems, requiring
          lengthy integration efforts for each connected system. Many systems
          cannot accommodate new and emerging types of learning activities –
          such as e-books, mobile device learning augmented reality, or
          simulations – and they fail to provide insight into the learning
          activities that comprise each course. Current course catalogs also use
          sparse, non-standard metadata to describe their courses, which limits
          the ability to share resources across DoD components, and identify
          course duplication.
        </p>
        
        <h2 className='text-xl font-semibold'>About the Project</h2>
        <p className='mb-2'>
          The ECC uses a metadata curation service to automatically generate
          metadata from different pools of information stored within the catalog
          owner’s local network. For example, DAU requires students to complete
          a course survey at the end of each course. These data are stored in
          DAU’s data warehouse and might be used to drive a course’s aggregate
          rating, which is a common feature found in most commercial course
          catalogs.
        </p>
        <p className='mb-2'>
          The automated metadata service provided by ECC facilitates the
          alignment of metadata across organizations and helps maintain
          up-to-date information in the ECC. The metadata can also be used to
          align learning activities (e.g., courses, instructional materials)
          with standardized data on careers, competencies, and credentials. This
          kind of data alignment is a key element of DoD’s Enterprise Digital
          Learning Modernization (EDLM) data strategy.
        </p>
        <p className='mb-2'>
          The ECC includes several subsystems that enable the discoverability
          and accessibility of all DoD instructional activities. The ADL
          Initiative is focused on building, integrating, testing, and deploying
          the services and systems required to enable this ECC vision.
        </p>
        <p className='mb-2'>
          In July 2018, the DoD Chief Management Officer (CMO) and the Reform
          Management Group formally initiated the EDLM reform initiative. The
          goal of the EDLM effort is to build an enterprise-wide integrated
          digital learning ecosystem that enables efficient acquisition and
          spending management for DoD education and training products and
          services. The ECC is one of the three EDLM lines of effort.
        </p>
        <p className='mb-2'>
          In July 2020, the ADL Initiative developed an ECC Pre-Alpha Prototype
          to validate the architectural approach for course catalog federation
          and to collect data about existing course catalog structures. Courses
          from Air Education and Training Command (AETC), Defense Acquisition
          University (DAU), and Naval Education and Training Command (NETC) were
          integrated into a common catalog portal powered by an open-source
          search and analytics engine (ElasticSearch) and visualization platform
          (Kibana).
        </p>
        <p className='mb-2'>
          In September 2020, the ADL Initiative kicked off the development of an
          operational Minimum Viable Product (MVP) ECC capability. The MVP will
          be scalable to support the global search and discovery of available
          courses within the ≈300 schoolhouses distributed across the DoD.
        </p>
        <p className='pb-4 mb-2'>
          Benefits of the ECC will include a broader, faster, and simplified
          capability to identify and access digital learning resources and
          opportunities across the DoD, and cost savings and cost avoidance
          through reduced duplication of courses and content.
        </p>
      </div>
    </DefaultLayout>
  );
}
