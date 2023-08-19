import csv
from django.http import HttpResponse
from enum import Enum

class ExportCsvMixin:
    def export_as_csv(self, request, queryset):
        CHUNK_SIZE = 2 # You can adjust the chunk size as needed

        meta = self.model._meta
        field_names = [field.name for field in meta.fields]

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename={}.csv'.format(meta)
        writer = csv.writer(response)

        writer.writerow(field_names)

        for offset in range(0, queryset.count(), CHUNK_SIZE):
            chunk = queryset[offset:offset + CHUNK_SIZE]
            print(offset)

            for obj in chunk:
                row = []
                for field_name in field_names:
                    field_value = getattr(obj, field_name)
                    if isinstance(field_value, Enum):
                        row.append(field_value.value)
                    else:
                        row.append(field_value)
                writer.writerow(row)

        return response

    export_as_csv.short_description = "Export Selected"

