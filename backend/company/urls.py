from django.urls import path
# from . import views
from .views import (

    #bysuppa
    register_company,
    login_company,
    create_job,
    list_jobs,
    get_company_details,
    get_company_jobs,
    # JobsByCompanyView,
    create_application,
    get_applications_by_job,
    get_application_details,
    UpdateApplicationStatusView,
    get_application_ids_by_student,
    get_job_details,
    get_job_details_scrape,
)

urlpatterns = [
    #by suppa


    path('register_company/', register_company, name='register_company'),
    path('login_company/', login_company, name='login_company'),
    path('create_job/', create_job, name='create_job'),
    path('list_jobs/', list_jobs, name='list_jobs'),
    path('<int:company_id>/', get_company_details, name='get_company_details'),  # New endpoint
    # path('jobs/company/<str:company_name>/', JobsByCompanyView.as_view(), name='jobs-by-company'),
    path('jobs/', list_jobs, name='list_jobs'),  # This should handle the query parameter

     path('<int:company_id>/jobs/', get_company_jobs, name='get_company_jobs'),  # New endpoint for jobs
    # path('jobs/company/<str:company_name>/', JobsByCompanyView.as_view(), name='jobs_by_company'),
    path('create_application/', create_application, name='create_application'),
    path('jobs/<int:job_id>/applications/', get_applications_by_job, name='get_applications_by_job'),  # New endpointfor applications by job_id
    path('applications/<int:application_id>/', get_application_details, name='get_application_details'),
    path('applications/<int:pk>/update_status/', UpdateApplicationStatusView.as_view(), name='update_application_status'),
    path('applications/student/<int:student_id>/', get_application_ids_by_student, name='get_application_ids_by_student'),
    path('jobs/<int:job_id>/', get_job_details, name='get_job_details'),
    path('jobs/<path:url>/', get_job_details_scrape, name='scrape_job_details'),
]