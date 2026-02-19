from django.contrib import admin

from core.models import (FilterMetadata, FilterRecord, Neo4jConfiguration,
                         XISConfiguration, XISDownstream, XISUpstream)


# Register your models here.
@admin.register(XISConfiguration)
class XISConfigurationAdmin(admin.ModelAdmin):
    list_display = ('target_schema', 'xss_host', 'xse_host', 'xse_index',
                    'autocomplete_field', 'filter_field',)
    fieldsets = (
        ('XSS Settings', {'fields':
                          ('xss_host', 'target_schema')}),
        ('XSE Settings', {'fields':
                          ('xse_host', 'xse_index', 'autocomplete_field',
                           'filter_field',)}))


@admin.register(XISUpstream)
class XISUpstreamAdmin(admin.ModelAdmin):
    list_display = ('xis_api_endpoint', 'xis_api_endpoint_status')
    fields = [('xis_api_endpoint', 'xis_api_endpoint_status'), ]
    filter_horizontal = ['metadata_experiences', 'supplemental_experiences']


@admin.register(XISDownstream)
class XISDownstreamAdmin(admin.ModelAdmin):
    list_display = ('xis_api_endpoint', 'xis_api_endpoint_status')
    fields = [('xis_api_endpoint', 'xis_api_key', 'xis_api_endpoint_status'),
              ('filter_records', 'filter_metadata'),
              ('source_name',)]
    filter_horizontal = ['composite_experiences',
                         'filter_records', 'filter_metadata']


@admin.register(FilterRecord)
class FilterRecordAdmin(admin.ModelAdmin):
    list_display = ('field_name', 'comparator', 'field_value',)
    fields = ('field_name', 'comparator', 'field_value',)


@admin.register(FilterMetadata)
class FilterMetadataAdmin(admin.ModelAdmin):
    list_display = ('field_name', 'operation',)
    fields = ('field_name', 'operation',)


@admin.register(Neo4jConfiguration)
class Neo4jConfigurationAdmin(admin.ModelAdmin):
    list_display = ('neo4j_uri', 'neo4j_user', 'neo4j_pwd',)
    fields = [('neo4j_uri', 'neo4j_user', 'neo4j_pwd',)]
