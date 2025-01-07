
from django.contrib import admin

# Register your models here.
from .models import StudentUser
from .models import Certificate
from .models import Experience
from .models import Project
from .models import Address,Skills


admin.site.register(Project)
admin.site.register(Address)
admin.site.register(Certificate)
admin.site.register(Experience)
admin.site.register(Skills)
admin.site.register(StudentUser)

