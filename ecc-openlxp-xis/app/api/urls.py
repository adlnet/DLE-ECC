from django.urls import path
from rest_framework.routers import DefaultRouter

from api import views

router = DefaultRouter()

app_name = 'api'

urlpatterns = [
    path('catalogs/', views.CatalogDataView.as_view(), name='catalog'),
    path('metadata/', views.MetaDataView.as_view(), name='metadata'),
    path('supplemental-data/', views.SupplementalDataView.as_view(),
         name='supplemental-data'),
    path('metadata/<str:course_id>/', views.UUIDDataView.as_view(),
         name='record_for_requested_course_id'),
    path('managed-data/catalogs', views.ManagedCatalogListView.as_view(),
         name='managed-catalog'),
    path('managed-data/catalogs/<str:provider_id>',
         views.ManagedCatalogDataView.as_view(), name='managed-catalog-data'),
    path('managed-data/catalogs/<str:provider_id>/<str:experience_id>',
         views.ManageDataView.as_view(), name='managed-data'),
    path('xis-workflow/', views.xis_workflow_api),
    path('xis-workflow/<int:task_id>', views.get_status),
    path('downstream-workflow/', views.xis_downstream_workflow_api),
    path('upstream-workflow/', views.xis_upstream_workflow_api),
    # path('post_to_neo4j/', views.post_to_neo4j,
    #      name='post_to_neo4j'),
]
