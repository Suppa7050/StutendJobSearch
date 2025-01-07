# #Company side views by suppa

# # from django.contrib.auth.models import Company
# from rest_framework.views import APIView
# from .models import Company
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from rest_framework_simplejwt.tokens import RefreshToken
# from django.contrib.auth import authenticate
# from django.http import JsonResponse, HttpResponse
# from django.contrib.auth.hashers import check_password
# from django.contrib.auth.hashers import make_password
# from rest_framework import status
# from rest_framework.response import Response
# from rest_framework.decorators import api_view
# from .serializers import JobSerializer
# from .models import Job
# from .serializers import ApplicationSerializer
# from .models import Application  # Make sure this line is present


# # Register view
# @api_view(['POST'])
# def register_company(request):
#     email = request.data.get('email')
#     password = request.data.get('password')
#     name=request.data.get('name')
#     location=request.data.get('location')
#     if Company.objects.filter(email=email).exists():
#         return Response({'error': 'email already exists'}, status=status.HTTP_400_BAD_REQUEST)
#     hashed_password = make_password(password)
#     user = Company.objects.create(email=email, password=hashed_password,name=name,location=location)
#     user.save()

#     return Response({'message': 'Company registered successfully'}, status=status.HTTP_201_CREATED)

# # # Login view
# # @api_view(['POST'])
# # def login_company(request):
#     # email = request.data.get('email')
#     # password = request.data.get('password')

#     # user = authenticate(email=email, password=password)
#     # if user is not None:
#     #     refresh = RefreshToken.for_user(user)
#     #     return Response({
#     #         'refresh': str(refresh),
#     #         'access': str(refresh.access_token),
#     #     })
#     # else:
#     #     return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
# @api_view(['POST'])
# def login_company(request):
#     email = request.data.get('email')
#     password = request.data.get('password')
#     print(email,password)
#     # Check if both email and password are provided
#     if not email or not password:
#         return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         # Check if the user with the provided email exists
#         user = Company.objects.get(email=email)
#     except Company.DoesNotExist:
#         return JsonResponse({'error': 'Invalid email or password.'}, status=401)

#     if check_password(password, user.password):
#         return JsonResponse({
#             'message': 'Login successful',
#             'user': {
#                 'id': user.id,
#                 'email': user.email,
                
#             }
#         }, status=200)
#     else:
#         return JsonResponse({'error': 'Invalid email or password.'}, status=401)





# @api_view(['POST'])
# def create_job(request):
#     print(request.data)
#     serializer = JobSerializer(data=request.data, context={'request': request})
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# # @api_view(['GET'])
# # def list_jobs(request):
# #     # Get the company name from query parameters
# #     company_name = request.query_params.get('company', None)

# #     if company_name:
# #         try:
# #             # Fetch the company by name
# #             company = Company.objects.get(name=company_name)
# #             # Retrieve all jobs for that company
# #             jobs = Job.objects.filter(company=company)
# #             if not jobs.exists():
# #                 return Response({"error": "No jobs found for this company."}, status=status.HTTP_404_NOT_FOUND)
# #         except Company.DoesNotExist:
# #             return Response({"error": "Company not found."}, status=status.HTTP_404_NOT_FOUND)
# #     else:
# #         # If no company name is provided, retrieve all jobs
# #         jobs = Job.objects.all()

# #     serializer = JobSerializer(jobs, many=True)
# #     return Response(serializer.data)
# @api_view(['GET'])
# def get_company_details(request, company_id):
#     try:
#         company = Company.objects.get(id=company_id)
#         company_data = {
#             'id': company.id,
#             'email': company.email,
#             'name': company.name,
#             'location': company.location
#         }
#         return JsonResponse(company_data, status=200)
#     except Company.DoesNotExist:
#         return JsonResponse({'error': 'Company not found.'}, status=404)


# from django.http import JsonResponse
# from .models import Job

# # def list_jobs(request):
# #     jobs = Job.objects.select_related('company').prefetch_related('questions').all()

# #     # Create a list to hold job data
# #     job_list = []

# #     for job in jobs:
# #         # Construct job data including company and questions
# #         job_data = {
# #             'id':job.id,
# #             'job_name': job.job_name,
# #             'job_role': job.job_role,
# #             'job_description': job.job_description,
# #             'last_date': job.last_date,
# #             'experience':job.experience,
# #             'type':job.type,
# #             'salary':job.salary,
# #             'company': {
# #                 'id': job.company.id,
# #                 'name': job.company.name,
# #                 'email': job.company.email,
# #                 'location': job.company.location
# #             },
# #             'questions': [{'id': question.id, 'question_text': question.question_text} for question in job.questions.all()]
# #         }

# #         # Append the job data to the job list
# #         job_list.append(job_data)

# #     # Return the job list as JSON response
# #     return JsonResponse(job_list, safe=False)
# @api_view(['GET'])
# def get_company_jobs(request, company_id):
#     # print(company_id)
#     try:
#         # Retrieve the company by ID
#         company = Company.objects.get(id=company_id)
#         # Fetch all jobs related to the company
#         jobs = company.jobs.all()  # Use the related name 'jobs' defined in the Job model

#         # Serialize job data
#         job_list = []
#         for job in jobs:
#             job_data = {
#                 'job_id': job.id,
#                 'job_name': job.job_name,
#                 'job_role': job.job_role,
#                 'job_description': job.job_description,
#                 'last_date': job.last_date,
#                 'experience':job.experience,
#                 'type':job.type,
#                 'salary':job.salary,

#             }
#             job_list.append(job_data)

#         # Return the list of jobs as a JSON response
#         return JsonResponse(job_list, safe=False)

#     except Company.DoesNotExist:
#         return JsonResponse({'error': 'Company not found.'}, status=404)
# @api_view(['GET'])
# def get_job_details(request, job_id):
#     try:
#         # Retrieve the job with the provided job_id
#         job = Job.objects.get(id=job_id)
        
#         # Serialize the job details
#         serializer = JobSerializer(job)
        
#         # Return the serialized job data as JSON response
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except Job.DoesNotExist:
#         return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# def create_application(request):
#     serializer = ApplicationSerializer(data=request.data)
    
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .serializers import ApplicationSerializer
# from .models import Job  # Import Job from the current app
# from django.http import JsonResponse
# from users.views import user_profile  # Adjust this import based on your project structure
# from django.test import RequestFactory  # Import RequestFactory
# import json

# from rest_framework.decorators import api_view
# from rest_framework.response import Response
# from rest_framework import status
# from .serializers import ApplicationSerializer
# from .models import Job  # Import Job from the current app
# from users.models import StudentUser  # Import StudentUser from the users app
# from django.http import JsonResponse
# from users.views import user_profile  # Adjust this import based on your project structure
# from django.test import RequestFactory  # Import RequestFactory
# from .models import RequiredSkills
# # @api_view(['POST'])
# # def create_application(request):
# #     serializer = ApplicationSerializer(data=request.data)

# #     if serializer.is_valid():
# #         # Extract student ID and job ID from request data
# #         student_id = request.data.get('student_id')
# #         job_id = request.data.get('job_id')

# #         # Fetch job details
# #         try:
# #             job = Job.objects.get(id=job_id)
# #         except Job.DoesNotExist:
# #             return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

# #         # Fetch mandatory skills for the job
# #         mandatory_skills = RequiredSkills.objects.filter(job=job, mandatory_flag=True).values_list('skill_name', flat=True)
# #         print(mandatory_skills)
# #         # Fetch student details using the existing user_profile function
# #         factory = RequestFactory()
# #         student_request = factory.get(f'/api/profile/{student_id}/')
# #         student_response = user_profile(student_request, student_id)
        
# #         # Extract data from the JsonResponse
# #         student_data = json.loads(student_response.content)
# #         student_skills = set(skill['skill_name'] for skill in student_data['skills'])  # Adjust key name if needed

# #         # Check if student has all mandatory skills
# #         missing_skills = [skill for skill in mandatory_skills if skill not in student_skills]
# #         if missing_skills:
# #             return Response(
# #                 {"error": "Student is missing the following mandatory skills: " + ", ".join(missing_skills)},
# #                 status=status.HTTP_400_BAD_REQUEST
# #             )

# #         # Save the application and prepare the response data
# #         application = serializer.save()
# #         response_data = {
# #             "application": serializer.data,
# #             "student": student_data['personal_info'],
# #             "job": {
# #                 "id": job.id,
# #                 "job_name": job.job_name,
# #                 "job_role": job.job_role,
# #                 "company_id": job.company_id,
# #             },
# #         }
        
# #         return Response(response_data, status=status.HTTP_201_CREATED)

# #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET'])
# def get_applications_by_job(request, job_id):
#     try:

#         applications = Application.objects.filter(job_id=job_id)  # Get applications for the specified job
#         serializer = ApplicationSerializer(applications, many=True)  # Serialize the data
#         return Response(serializer.data, status=status.HTTP_200_OK)  # Return the serialized data
#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



# @api_view(['GET'])
# def get_application_details(request, application_id):
#     # print("application by jobid")
#     try:
#         # Retrieve the application by ID
#         application = Application.objects.get(id=application_id)
#         # print(application)
#     except Application.DoesNotExist:
#         return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

#     # Serialize the application details with answers and questions
#     serializer = ApplicationSerializer(application)
#     print(serializer.data)
#     return Response(serializer.data, status=status.HTTP_200_OK)


# class UpdateApplicationStatusView(APIView):
#     def patch(self, request, pk):
#         try:
#             application = Application.objects.get(pk=pk)
#         except Application.DoesNotExist:
#             return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
        
#         # Update only the status field
#         application.status = request.data.get("status")
#         application.save()

#         return Response({"message": "Status updated successfully", "status": application.status}, status=status.HTTP_200_OK)
    
# @api_view(['GET'])
# def get_application_ids_by_student(request, student_id):
#     try:
#         # Filter applications by the provided student_id
#         applications = Application.objects.filter(student_id=student_id)
        
#         # Extract only the application IDs
#         application_ids = applications.values_list('id', flat=True)
        
#         # Return the list of application IDs as a JSON response
#         return Response({"application_ids": list(application_ids)}, status=status.HTTP_200_OK)
#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    




# # views.py

# from django.http import JsonResponse
# from .models import Job
# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from webdriver_manager.chrome import ChromeDriverManager
# from selenium.webdriver.chrome.options import Options
# from bs4 import BeautifulSoup
# import time
# import os
# import csv
# from datetime import datetime


# # Function to get the current date as a string
# def get_today_date():
#     return datetime.now().strftime("%Y-%m-%d")


# # Check if the scraping has already been done today
# def is_scraping_done_today():
#     last_scraped_date_file = 'last_scraped_date.txt'
    
#     if os.path.exists(last_scraped_date_file):
#         with open(last_scraped_date_file, 'r') as f:
#             last_scraped_date = f.read().strip()
#             return last_scraped_date == get_today_date()
#     return False


# # Update the last scraped date to today
# def update_scraped_date():
#     last_scraped_date_file = 'last_scraped_date.txt'
#     with open(last_scraped_date_file, 'w') as f:
#         f.write(get_today_date())


# def get_dom(driver, url):
#     driver.get(url)
#     page_content = driver.page_source
#     soup = BeautifulSoup(page_content, 'html.parser')
#     return soup


# def get_job_link(job):
#     try:
#         return job.select_one('h2 a')['href']
#     except Exception:
#         return 'Not available'


# def get_job_title(job):
#     try:
#         return job.select_one('h2 a span').get_text()
#     except Exception:
#         return 'Not available'


# def get_company_name(job):
#     try:
#         return job.select_one('span[data-testid="company-name"]').get_text()
#     except Exception:
#         return 'Not available'


# def get_company_location(job):
#     try:
#         return job.select_one('div.company_location div[data-testid="text-location"]').get_text()
#     except Exception:
#         return 'Not available'


# def get_salary(job):
#     try:
#         salary = job.select('span.estimated-salary span')
#         if salary:
#             return salary[0].get_text()
#     except Exception:
#         pass

#     try:
#         salary = job.select_one('div.metadata.salary-snippet-container div').get_text()
#         return salary
#     except Exception:
#         return 'Not available'


# def list_jobs(request):
#     # Get jobs from the database
#     jobs = Job.objects.select_related('company').prefetch_related('questions').all()

#     # Create a list to hold job data
#     job_list = []

#     for job in jobs:
#         # Construct job data including company and questions from the database
#         job_data = {
#             'id': job.id,
#             'job_name': job.job_name or "N/A",  # Set to "N/A" if not found
#             'job_role': job.job_role or "N/A",  # Set to "N/A" if not found
#             'job_description': job.job_description or "N/A",  # Set to "N/A" if not found
#             'last_date': job.last_date or "N/A",  # Set to "N/A" if not found
#             'experience': job.experience or "N/A",  # Set to "N/A" if not found
#             'type': job.type or "N/A",  # Set to "N/A" if not found
#             'salary': job.salary or "N/A",  # Set to "N/A" if not found
#             'company': {
#                 'id': job.company.id,
#                 'name': job.company.name or "N/A",  # Set to "N/A" if not found
#                 'email': job.company.email or "N/A",  # Set to "N/A" if not found
#                 'location': job.company.location or "N/A"  # Set to "N/A" if not found
#             },
#             'scrapeflag': False,  # Mark as False for jobs from the database
#             'questions': [{'id': question.id, 'question_text': question.question_text or "N/A"} for question in job.questions.all()],
#         }
#         job_list.append(job_data)

#     # Check if scraping has been done today
#     if not is_scraping_done_today():
#         # Scrape additional jobs
#         chrome_options = Options()
#         driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

#         # Base URL for Indeed with placeholders
#         pagination_url = "https://in.indeed.com/jobs?l={}&sc=0kf%3Aattr%28HFDVW%29jt%28internship%29%3B&start={}"

#         job_search_keyword = ['Software+Engineer']
#         location_search_keyword = ['Hyderabad']
#         job_type_keyword = ['internship']  # Job types: internship, new graduates
#         education_levels = ['attr%28HFDVW%29']  # Include bachelors or exclude (empty string for no bachelors)

#         all_scraped_jobs = []

#         for job_keyword in job_search_keyword:
#             for location_keyword in location_search_keyword:
#                 for job_type in job_type_keyword:
#                     for education_level in education_levels:
#                         for page_no in range(0, 10, 10):  # Scraping first 10 pages
#                             # Format the URL dynamically
#                             url = pagination_url.format(location_keyword, education_level, job_type, page_no)
#                             print(f"Scraping page: {url}")

#                             page_dom = get_dom(driver, url)
#                             jobs = page_dom.select('div.job_seen_beacon')

#                             for job in jobs:
#                                 job_link = "https://in.indeed.com" + get_job_link(job)
#                                 job_title = get_job_title(job) or "N/A"  # Set to "N/A" if not found
#                                 company_name = get_company_name(job) or "N/A"  # Set to "N/A" if not found
#                                 company_location = get_company_location(job) or "N/A"  # Set to "N/A" if not found
#                                 salary = get_salary(job) or "N/A"  # Set to "N/A" if not found

#                                 job_data = {
#                                     'id': "N/A",  # Placeholder value for scraped jobs
#                                     'job_name': job_title,
#                                     'job_role': "N/A",  # No role info in scraped jobs
#                                     'job_description': "Click here to check description.....",  # No description info in scraped jobs
#                                     'last_date': "N/A",  # No date info in scraped jobs
#                                     'experience': "0",  # No experience info in scraped jobs
#                                     'type': "N/A",  # No type info in scraped jobs
#                                     'salary': salary,
#                                     'company': {
#                                         'id': "N/A",  # Placeholder value for company id
#                                         'name': company_name,
#                                         'email': "N/A",  # No email info in scraped jobs
#                                         'location': company_location
#                                     },
#                                     'scrapeflag': True,  # Mark as True for scraped jobs
#                                     'job_link':job_link,
#                                     'questions': [],  # No questions info for scraped jobs
#                                 }

#                                 all_scraped_jobs.append(job_data)

#         driver.quit()

#         # Save the scraped jobs to CSV
#         # Save the scraped jobs to CSV
#         with open('indeed_jobs.csv', 'w', newline='', encoding='utf-8') as f:
#             theWriter = csv.writer(f)
#             heading = ['job_link', 'job_name', 'company_name', 'company_location', 'salary']  # Update 'job_title' to 'job_name'
#             theWriter.writerow(heading)

#             for job in all_scraped_jobs:
#                 theWriter.writerow([job['job_link'], job['job_name'], job['company']['name'], job['company']['location'], job['salary']])

#         update_scraped_date()

#     # Read the CSV data
#     csv_data = []
#     with open('indeed_jobs.csv', 'r', encoding='utf-8') as f:
#         reader = csv.reader(f)
#         next(reader)  # Skip the header
#         for row in reader:
#             csv_data.append({
#                 'id': "N/A",  # Placeholder value for scraped jobs
#                 'job_name': row[1],
#                 'job_role': "N/A",  # No role info in scraped jobs
#                 'job_description': "Click here to check description.....",  # No description info in scraped jobs
#                 'last_date': "N/A",  # No date info in scraped jobs
#                 'experience': "0",  # No experience info in scraped jobs
#                 'type': "N/A",  # No type info in scraped jobs
#                 'salary': row[4],
#                 'company': {
#                     'id': "N/A",  # Placeholder value for company id
#                     'name': row[2],
#                     'email': "N/A",  # No email info in scraped jobs
#                     'location': row[3]
#                 },
#                 'scrapeflag': True,  # Mark as True for scraped jobs
#                 'job_link':row[0],
#                 'questions': [],  # No questions info for scraped jobs
#             })

#     # Merge the scraped jobs and database jobs
#     merged_jobs = job_list + csv_data

#     # Return the merged list of jobs as a JSON response
#     return JsonResponse(merged_jobs, safe=False)





# # import re
# # from bs4 import BeautifulSoup
# # from django.http import JsonResponse
# # from rest_framework.decorators import api_view
# # import urllib
# # from selenium import webdriver
# # from selenium.webdriver.chrome.service import Service
# # from selenium.webdriver.chrome.options import Options
# # from webdriver_manager.chrome import ChromeDriverManager
# # from selenium.webdriver.common.by import By
# # from selenium.webdriver.support.ui import WebDriverWait
# # from selenium.webdriver.support import expected_conditions as EC

# # # Set up Selenium WebDriver
# # chrome_options = Options()
# # driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# # # Function to remove <svg> tags from the HTML
# # def remove_svgs_from_html(html):
# #     soup = BeautifulSoup(html, 'html.parser')
# #     for svg in soup.find_all('svg'):
# #         svg.decompose()  # Remove the <svg> element
# #     for ele in soup.find_all('js-match-insights-provider-g3j9ld'):
# #         ele.decompose()
# #     for ele in soup.find_all('css-173agvp eu4oa1w0'):
# #         ele.decompose()
# #     return str(soup)

# # @api_view(['GET'])
# # def get_job_details_scrape(request, url):
# #     print(url)
# #     # Decode the job URL
# #     job_url = urllib.parse.unquote(url)  # Decodes the URL
# #     print(url)
# #     # Check if the job_url is valid
# #     if not job_url:
# #         return JsonResponse({"error": "Job URL is required"}, status=400)

# #     # Set up Selenium WebDriver
# #     chrome_options = Options()
# #     driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# #     # Function to scrape job details
# #     def scrape_job_details(url):
# #         driver.get(url)
        
# #         # Wait for the element with the specified classes to be present
# #         try:
# #             WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, ".jobsearch-JobComponent.css-u4y1in.eu4oa1w0.jobsearch-JobComponent-bottomDivider")))
            
# #             # Extract the entire job component as HTML
# #             job_component_html = driver.find_element(By.CSS_SELECTOR, ".jobsearch-JobComponent.css-u4y1in.eu4oa1w0.jobsearch-JobComponent-bottomDivider").get_attribute('outerHTML')

# #             # Remove any <svg> tags from the scraped HTML
# #             sanitized_html = remove_svgs_from_html(job_component_html)
            
# #             return sanitized_html  # Return the cleaned HTML

# #         except Exception as e:
# #             print(f"Error: {e}")
# #             return None
# #         finally:
# #             driver.quit()

# #     # Get the cleaned job details HTML
# #     job_details_html = scrape_job_details(job_url)

# #     if job_details_html:
# #         return JsonResponse({"job_component_html": job_details_html})
# #     else:
# #         return JsonResponse({"error": "Failed to scrape job details"}, status=500)

# from django.http import JsonResponse
# from rest_framework.decorators import api_view
# from selenium import webdriver
# from selenium.webdriver.chrome.service import Service
# from selenium.webdriver.chrome.options import Options
# from selenium.webdriver.common.by import By
# from selenium.webdriver.support.ui import WebDriverWait
# from selenium.webdriver.support import expected_conditions as EC
# from webdriver_manager.chrome import ChromeDriverManager
# import urllib.parse  # For URL decoding

# @api_view(['GET'])
# def get_job_details_scrape(request, url):
#     print(url)
#     # Decode the job URL
#     job_url = urllib.parse.unquote(url)  # Decodes the URL
#     print(url)
#     # Check if the job_url is valid
#     if not job_url:
#         return JsonResponse({"error": "Job URL is required"}, status=400)

#     # Set up Selenium WebDriver
#     # chrome_options = Options()
#     # chrome_options.add_argument('--headless')  # Run browser in headless mode
#     # chrome_options.add_argument('--no-sandbox')
#     # chrome_options.add_argument('--disable-dev-shm-usage')

# # Set up Selenium WebDriver
#     chrome_options = Options()
#     driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

#     # Function to scrape job details
#     def scrape_job_details(url):
#         print("url")
#         driver.get(url)
#         job_details = {}

#         # Extract job details
#         try:
#             job_details['job_title'] = WebDriverWait(driver, 2).until(
#                 EC.presence_of_element_located((By.CSS_SELECTOR, 'h1.jobsearch-JobInfoHeader-title'))
#             ).text
#         except Exception:
#             job_details['job_title'] = 'Not available'

#         try:
#             job_details['company'] = WebDriverWait(driver, 2).until(
#                 EC.presence_of_element_located((By.CSS_SELECTOR, 'div.jobsearch-JobInfoHeader-companyNameLink'))
#             ).text
#         except Exception:
#             job_details['company'] = 'Not available'

#         try:
#             job_details['location'] = WebDriverWait(driver, 2).until(
#                 EC.presence_of_element_located((By.CSS_SELECTOR, 'div.css-1tlxeot.eu4oa1w0'))
#             ).text
#         except Exception:
#             job_details['location'] = 'Not available'

#         try:
#             job_details['desc'] = WebDriverWait(driver, 2).until(
#                 EC.presence_of_element_located((By.CSS_SELECTOR, 'div.jobsearch-JobComponent-description'))
#             ).text
#         except Exception:
#             job_details['desc'] = 'Not available'

#         try:
#             apply_button = WebDriverWait(driver, 2).until(
#                 EC.presence_of_element_located((By.CSS_SELECTOR, 'div.css-kyg8or a'))
#             )
#             job_details['apply_link'] = apply_button.get_attribute('href')
#         except Exception:
#             job_details['apply_link'] = 'Not available'

#         return job_details

#     # Scrape the job details
#     job_details = scrape_job_details(job_url)

#     # Close the driver
#     driver.quit()

#     return JsonResponse(job_details)


#Company side views by suppa

# from django.contrib.auth.models import Company
from rest_framework.views import APIView
from .models import Company
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.hashers import check_password
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import JobSerializer
from .models import Job
from .serializers import ApplicationSerializer
from .models import Application  # Make sure this line is present


# Register view
@api_view(['POST'])
def register_company(request):
    email = request.data.get('email')
    password = request.data.get('password')
    name=request.data.get('name')
    location=request.data.get('location')
    if Company.objects.filter(email=email).exists():
        return Response({'error': 'email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    hashed_password = make_password(password)
    user = Company.objects.create(email=email, password=hashed_password,name=name,location=location)
    user.save()

    return Response({'message': 'Company registered successfully'}, status=status.HTTP_201_CREATED)

# # Login view
# @api_view(['POST'])
# def login_company(request):
    # email = request.data.get('email')
    # password = request.data.get('password')

    # user = authenticate(email=email, password=password)
    # if user is not None:
    #     refresh = RefreshToken.for_user(user)
    #     return Response({
    #         'refresh': str(refresh),
    #         'access': str(refresh.access_token),
    #     })
    # else:
    #     return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['POST'])
def login_company(request):
    email = request.data.get('email')
    password = request.data.get('password')
    print(email,password)
    # Check if both email and password are provided
    if not email or not password:
        return Response({'error': 'Email and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Check if the user with the provided email exists
        user = Company.objects.get(email=email)
    except Company.DoesNotExist:
        return JsonResponse({'error': 'Invalid email or password.'}, status=401)

    if check_password(password, user.password):
        return JsonResponse({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                
            }
        }, status=200)
    else:
        return JsonResponse({'error': 'Invalid email or password.'}, status=401)





@api_view(['POST'])
def create_job(request):
    print(request.data)
    serializer = JobSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# @api_view(['GET'])
# def list_jobs(request):
#     # Get the company name from query parameters
#     company_name = request.query_params.get('company', None)

#     if company_name:
#         try:
#             # Fetch the company by name
#             company = Company.objects.get(name=company_name)
#             # Retrieve all jobs for that company
#             jobs = Job.objects.filter(company=company)
#             if not jobs.exists():
#                 return Response({"error": "No jobs found for this company."}, status=status.HTTP_404_NOT_FOUND)
#         except Company.DoesNotExist:
#             return Response({"error": "Company not found."}, status=status.HTTP_404_NOT_FOUND)
#     else:
#         # If no company name is provided, retrieve all jobs
#         jobs = Job.objects.all()

#     serializer = JobSerializer(jobs, many=True)
#     return Response(serializer.data)
@api_view(['GET'])
def get_company_details(request, company_id):
    try:
        company = Company.objects.get(id=company_id)
        company_data = {
            'id': company.id,
            'email': company.email,
            'name': company.name,
            'location': company.location
        }
        return JsonResponse(company_data, status=200)
    except Company.DoesNotExist:
        return JsonResponse({'error': 'Company not found.'}, status=404)


from django.http import JsonResponse
from .models import Job

# def list_jobs(request):
#     jobs = Job.objects.select_related('company').prefetch_related('questions').all()

#     # Create a list to hold job data
#     job_list = []

#     for job in jobs:
#         # Construct job data including company and questions
#         job_data = {
#             'id':job.id,
#             'job_name': job.job_name,
#             'job_role': job.job_role,
#             'job_description': job.job_description,
#             'last_date': job.last_date,
#             'experience':job.experience,
#             'type':job.type,
#             'salary':job.salary,
#             'company': {
#                 'id': job.company.id,
#                 'name': job.company.name,
#                 'email': job.company.email,
#                 'location': job.company.location
#             },
#             'questions': [{'id': question.id, 'question_text': question.question_text} for question in job.questions.all()]
#         }

#         # Append the job data to the job list
#         job_list.append(job_data)

#     # Return the job list as JSON response
#     return JsonResponse(job_list, safe=False)
@api_view(['GET'])
def get_company_jobs(request, company_id):
    # print(company_id)
    try:
        # Retrieve the company by ID
        company = Company.objects.get(id=company_id)
        # Fetch all jobs related to the company
        jobs = company.jobs.all()  # Use the related name 'jobs' defined in the Job model

        # Serialize job data
        job_list = []
        for job in jobs:
            job_data = {
                'job_id': job.id,
                'job_name': job.job_name,
                'job_role': job.job_role,
                'job_description': job.job_description,
                'last_date': job.last_date,
                'experience':job.experience,
                'type':job.type,
                'salary':job.salary,

            }
            job_list.append(job_data)

        # Return the list of jobs as a JSON response
        return JsonResponse(job_list, safe=False)

    except Company.DoesNotExist:
        return JsonResponse({'error': 'Company not found.'}, status=404)
@api_view(['GET'])
def get_job_details(request, job_id):
    try:
        # Retrieve the job with the provided job_id
        job = Job.objects.get(id=job_id)
        
        # Serialize the job details
        serializer = JobSerializer(job)
        
        # Return the serialized job data as JSON response
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Job.DoesNotExist:
        return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_application(request):
    serializer = ApplicationSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import ApplicationSerializer
from .models import Job  # Import Job from the current app
from django.http import JsonResponse
from users.views import user_profile  # Adjust this import based on your project structure
from django.test import RequestFactory  # Import RequestFactory
import json

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import ApplicationSerializer
from .models import Job  # Import Job from the current app
from users.models import StudentUser  # Import StudentUser from the users app
from django.http import JsonResponse
from users.views import user_profile  # Adjust this import based on your project structure
from django.test import RequestFactory  # Import RequestFactory
from .models import RequiredSkills
# @api_view(['POST'])
# def create_application(request):
#     serializer = ApplicationSerializer(data=request.data)

#     if serializer.is_valid():
#         # Extract student ID and job ID from request data
#         student_id = request.data.get('student_id')
#         job_id = request.data.get('job_id')

#         # Fetch job details
#         try:
#             job = Job.objects.get(id=job_id)
#         except Job.DoesNotExist:
#             return Response({"error": "Job not found."}, status=status.HTTP_404_NOT_FOUND)

#         # Fetch mandatory skills for the job
#         mandatory_skills = RequiredSkills.objects.filter(job=job, mandatory_flag=True).values_list('skill_name', flat=True)
#         print(mandatory_skills)
#         # Fetch student details using the existing user_profile function
#         factory = RequestFactory()
#         student_request = factory.get(f'/api/profile/{student_id}/')
#         student_response = user_profile(student_request, student_id)
        
#         # Extract data from the JsonResponse
#         student_data = json.loads(student_response.content)
#         student_skills = set(skill['skill_name'] for skill in student_data['skills'])  # Adjust key name if needed

#         # Check if student has all mandatory skills
#         missing_skills = [skill for skill in mandatory_skills if skill not in student_skills]
#         if missing_skills:
#             return Response(
#                 {"error": "Student is missing the following mandatory skills: " + ", ".join(missing_skills)},
#                 status=status.HTTP_400_BAD_REQUEST
#             )

#         # Save the application and prepare the response data
#         application = serializer.save()
#         response_data = {
#             "application": serializer.data,
#             "student": student_data['personal_info'],
#             "job": {
#                 "id": job.id,
#                 "job_name": job.job_name,
#                 "job_role": job.job_role,
#                 "company_id": job.company_id,
#             },
#         }
        
#         return Response(response_data, status=status.HTTP_201_CREATED)

#     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_applications_by_job(request, job_id):
    try:

        applications = Application.objects.filter(job_id=job_id)  # Get applications for the specified job
        serializer = ApplicationSerializer(applications, many=True)  # Serialize the data
        return Response(serializer.data, status=status.HTTP_200_OK)  # Return the serialized data
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_application_details(request, application_id):
    # print("application by jobid")
    try:
        # Retrieve the application by ID
        application = Application.objects.get(id=application_id)
        # print(application)
    except Application.DoesNotExist:
        return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)

    # Serialize the application details with answers and questions
    serializer = ApplicationSerializer(application)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)


# class UpdateApplicationStatusView(APIView):
#     def patch(self, request, pk):
#         try:
#             application = Application.objects.get(pk=pk)
#         except Application.DoesNotExist:
#             return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
        
#         # Update only the status field
#         application.status = request.data.get("status")
#         application.save()

#         return Response({"message": "Status updated successfully", "status": application.status}, status=status.HTTP_200_OK)
    

    from django.core.mail import send_mail
from django.conf import settings  # For accessing email configurations
from .models import Application, Job  # Ensure Job is imported if needed

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Application

class UpdateApplicationStatusView(APIView):
    def patch(self, request, pk):
        try:
            application = Application.objects.get(pk=pk)
        except Application.DoesNotExist:
            return Response({"error": "Application not found."}, status=status.HTTP_404_NOT_FOUND)
        
        # Update only the status field
        new_status = request.data.get("status")
        if new_status in ['accepted', 'rejected']:
            application.status = new_status
            application.save()  # This will automatically trigger email sending via the signal

        return Response({"message": f"Status updated to {new_status}", "status": application.status}, status=status.HTTP_200_OK)

        
@api_view(['GET'])
def get_application_ids_by_student(request, student_id):
    try:
        # Filter applications by the provided student_id
        applications = Application.objects.filter(student_id=student_id)
        
        # Extract only the application IDs
        application_ids = applications.values_list('id', flat=True)
        
        # Return the list of application IDs as a JSON response
        return Response({"application_ids": list(application_ids)}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    




# views.py

from django.http import JsonResponse
from .models import Job
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import time
import os
import csv
from datetime import datetime
from datetime import date


# Function to get the current date as a string
def get_today_date():
    return datetime.now().strftime("%Y-%m-%d")


# Check if the scraping has already been done today
def is_scraping_done_today():
    last_scraped_date_file = 'last_scraped_date.txt'
    
    if os.path.exists(last_scraped_date_file):
        with open(last_scraped_date_file, 'r') as f:
            last_scraped_date = f.read().strip()
            return last_scraped_date == get_today_date()
    return False


# Update the last scraped date to today
def update_scraped_date():
    last_scraped_date_file = 'last_scraped_date.txt'
    with open(last_scraped_date_file, 'w') as f:
        f.write(get_today_date())


def get_dom(driver, url):
    driver.get(url)
    page_content = driver.page_source
    soup = BeautifulSoup(page_content, 'html.parser')
    return soup


def get_job_link(job):
    try:
        return job.select_one('h2 a')['href']
    except Exception:
        return 'Not available'


def get_job_title(job):
    try:
        return job.select_one('h2 a span').get_text()
    except Exception:
        return 'Not available'


def get_company_name(job):
    try:
        return job.select_one('span[data-testid="company-name"]').get_text()
    except Exception:
        return 'Not available'


def get_company_location(job):
    try:
        return job.select_one('div.company_location div[data-testid="text-location"]').get_text()
    except Exception:
        return 'Not available'


def get_salary(job):
    try:
        salary = job.select('span.estimated-salary span')
        if salary:
            return salary[0].get_text()
    except Exception:
        pass

    try:
        salary = job.select_one('div.metadata.salary-snippet-container div').get_text()
        return salary
    except Exception:
        return 'Not available'


def list_jobs(request):
    # Get jobs from the database
    jobs = Job.objects.select_related('company').prefetch_related('questions').all()

    # Create a list to hold job data
    job_list = []

    for job in jobs:
    # Check if the job's last date has not passed
        if job.last_date and job.last_date >= date.today():
            # Construct job data including company and questions from the database
            job_data = {
                'id': job.id,
                'job_name': job.job_name or "N/A",  # Set to "N/A" if not found
                'job_role': job.job_role or "N/A",  # Set to "N/A" if not found
                'job_description': job.job_description or "N/A",  # Set to "N/A" if not found
                'last_date': job.last_date or "N/A",  # Set to "N/A" if not found
                'experience': job.experience or "N/A",  # Set to "N/A" if not found
                'type': job.type or "N/A",  # Set to "N/A" if not found
                'salary': job.salary or "N/A",  # Set to "N/A" if not found
                'company': {
                    'id': job.company.id,
                    'name': job.company.name or "N/A",  # Set to "N/A" if not found
                    'email': job.company.email or "N/A",  # Set to "N/A" if not found
                    'location': job.company.location or "N/A"  # Set to "N/A" if not found
                },
                'scrapeflag': False,  # Mark as False for jobs from the database
                'questions': [{'id': question.id, 'question_text': question.question_text or "N/A"} for question in job.questions.all()],
            }
            job_list.append(job_data)

    # Check if scraping has been done today
    if not is_scraping_done_today():
        print("not scraped today\n\n\n\n\n\n")
        # Scrape additional jobs
        chrome_options = Options()
        driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

        # Base URL for Indeed with placeholders
        # pagination_url = "https://in.indeed.com/jobs?q={}&l={}&sc=0kf%3Aattr%28HFDVW%29jt%28internship%29%3B&start={}"
        # pagination_url = "https://in.indeed.com/jobs?&l={}&sc=0kf%3A{}jt%28{}%29%3B&start={}"
        pagination_url = "https://in.indeed.com/jobs?q={}&l={}&sc=0kf%3A{}jt%28{}%29%3B&start={}"


        job_search_keyword = ['Software+Engineer']
        location_search_keyword = ['Hyderabad']
        job_type_keyword = ['internship']  # Job types: internship, new graduates
        education_levels = ['attr%28HFDVW%29']  # Include bachelors or exclude (empty string for no bachelors)

        all_scraped_jobs = []

        for job_keyword in job_search_keyword:
            for location_keyword in location_search_keyword:
                for job_type in job_type_keyword:
                    for education_level in education_levels:
                        for page_no in range(0, 10, 10):  # Scraping first 10 pages
                            # Format the URL dynamically
                            url = pagination_url.format(job_keyword,location_keyword, education_level, job_type, page_no)
                            print(f"Scraping page: {url}")

                            page_dom = get_dom(driver, url)
                            jobs = page_dom.select('div.job_seen_beacon')

                            for job in jobs:
                                job_link = "https://in.indeed.com" + get_job_link(job)
                                job_title = get_job_title(job) or "N/A"  # Set to "N/A" if not found
                                company_name = get_company_name(job) or "N/A"  # Set to "N/A" if not found
                                company_location = get_company_location(job) or "N/A"  # Set to "N/A" if not found
                                salary = get_salary(job) or "N/A"  # Set to "N/A" if not found

                                job_data = {
                                    'id': "N/A",  # Placeholder value for scraped jobs
                                    'job_name': job_title,
                                    'job_role': "N/A",  # No role info in scraped jobs
                                    'job_description': "Click here to check description.....",  # No description info in scraped jobs
                                    'last_date': "N/A",  # No date info in scraped jobs
                                    'experience': "0",  # No experience info in scraped jobs
                                    'type': "N/A",  # No type info in scraped jobs
                                    'salary': salary,
                                    'company': {
                                        'id': "N/A",  # Placeholder value for company id
                                        'name': company_name,
                                        'email': "N/A",  # No email info in scraped jobs
                                        'location': company_location
                                    },
                                    'scrapeflag': True,  # Mark as True for scraped jobs
                                    'job_link':job_link,
                                    'questions': [],  # No questions info for scraped jobs
                                }

                                all_scraped_jobs.append(job_data)

        driver.quit()

        # Save the scraped jobs to CSV
        # Save the scraped jobs to CSV
        with open('indeed_jobs.csv', 'w', newline='', encoding='utf-8') as f:
            theWriter = csv.writer(f)
            heading = ['job_link', 'job_name', 'company_name', 'company_location', 'salary']  # Update 'job_title' to 'job_name'
            theWriter.writerow(heading)

            for job in all_scraped_jobs:
                theWriter.writerow([job['job_link'], job['job_name'], job['company']['name'], job['company']['location'], job['salary']])

        update_scraped_date()

    # Read the CSV data
    csv_data = []
    with open('indeed_jobs.csv', 'r', encoding='utf-8') as f:
        print("soundy\n\n\n\n\n")
        reader = csv.reader(f)
        next(reader)  # Skip the header
        for row in reader:
            csv_data.append({
                'id': "N/A",  # Placeholder value for scraped jobs
                'job_name': row[1],
                'job_role': "N/A",  # No role info in scraped jobs
                'job_description': "Click here to check description.....",  # No description info in scraped jobs
                'last_date': "N/A",  # No date info in scraped jobs
                'experience': "0",  # No experience info in scraped jobs
                'type': "N/A",  # No type info in scraped jobs
                'salary': row[4],
                'company': {
                    'id': "N/A",  # Placeholder value for company id
                    'name': row[2],
                    'email': "N/A",  # No email info in scraped jobs
                    'location': row[3]
                },
                'scrapeflag': True,  # Mark as True for scraped jobs
                'job_link':row[0],
                'questions': [],  # No questions info for scraped jobs
            })

    # Merge the scraped jobs and database jobs
    merged_jobs = job_list + csv_data

    # Return the merged list of jobs as a JSON response
    return JsonResponse(merged_jobs, safe=False)





import re
from bs4 import BeautifulSoup
from django.http import JsonResponse
from rest_framework.decorators import api_view
import urllib
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set up Selenium WebDriver
# chrome_options = Options()
# driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

# Function to remove <svg> tags from the HTML
def remove_svgs_from_html(html):
    soup = BeautifulSoup(html, 'html.parser')
    for svg in soup.find_all('svg'):
        svg.decompose()  # Remove the <svg> element
    for ele in soup.find_all('js-match-insights-provider-g3j9ld'):
        ele.decompose()
    for ele in soup.find_all('css-173agvp eu4oa1w0'):
        ele.decompose()
    return str(soup)

@api_view(['GET'])
def get_job_details_scrape(request, url):
    print("url")
    # Decode the job URL
    job_url = urllib.parse.unquote(url)  # Decodes the URL
    print(url)
    # Check if the job_url is valid
    if not job_url:
        return JsonResponse({"error": "Job URL is required"}, status=400)

    # Set up Selenium WebDriver
    chrome_options = Options()
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=chrome_options)

    # Function to scrape job details
    def scrape_job_details(driver, job_url):
        """Scrape detailed job information from individual job page."""
        try:
            driver.get(job_url)
            
            # Wait for page to load with multiple potential selectors
            selectors = [
                'h1.jobsearch-JobInfoHeader-title',
                'h1[data-jobsearch-header="true"]',
                'div.jobsearch-JobComponent-title',
                'h2[data-e2e="job-title"]',
                'div.css-b7wndk e1tiznh50',
            ]
            
            job_title = None
            for selector in selectors:
                try:
                    print("job not yet there")
                    job_title_element = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
                    )

                    job_title = job_title_element.text
                    print("job",job_title)
                    break
                except:
                    continue
            
            # Company name with multiple selectors
            company_selectors = [
                'div.jobsearch-JobInfoHeader-companyNameLink',
                'div[data-company-name="true"]',
                'div.jobsearch-CompanyInfoContainer a',
                'span[data-testid="company-name"]'
            ]
            
            company_name = None
            for selector in company_selectors:
                try:
                    company_element = driver.find_element(By.CSS_SELECTOR, selector)
                    company_name = company_element.text
                    break
                except:
                    continue
            
            # Location selectors
            location_selectors = [
                'div[data-testid="inlineHeader-companyLocation"]',
                'div.jobsearch-JobInfoHeader-subtitle div',
                'div.jobsearch-CompanyInfoContainer span'
            ]
            
            location = None
            for selector in location_selectors:
                try:
                    location_element = driver.find_element(By.CSS_SELECTOR, selector)
                    location = location_element.text
                    break
                except:
                    continue
            
            # Job Description
            description_selectors = [
                'div.jobsearch-JobComponent-description',
                'div#jobDescriptionText',
                'div[data-jobsearch-description="true"]'
            ]
            
            job_description = None
            for selector in description_selectors:
                try:
                    description_element = driver.find_element(By.CSS_SELECTOR, selector)
                    job_description = description_element.text
                    break
                except:
                    continue
            
            
            
            
            job_type = 'Not available'
            try:
                # Locate the section containing 'Job type' text
                job_type_section = driver.find_element(By.XPATH, '//h3[contains(text(), "Job type")]/following-sibling::div')
                job_type_elements = job_type_section.find_elements(By.CSS_SELECTOR, 'ul li')
                if job_type_elements:
                    job_type = [element.text.strip() for element in job_type_elements]  # Collect all job types
                    job_type = ', '.join(job_type)  # Combine job types into a single string
            except Exception as e:
                print(f"Error extracting job type: {e}")
            
            # Apply link extraction
            apply_link = 'Not available'
            try:
                apply_buttons = driver.find_elements(By.CSS_SELECTOR, 'div.css-kyg8or button')
                if apply_buttons:
                    apply_link = apply_buttons[0].get_attribute('href')
            except Exception as e:
                print(f"Error finding apply link: {e}")
            
            
            # Compile job details
            job_details = {
                'Job Title': job_title or 'Not available',
                'Company': company_name or 'Not available',
                'Location': location or 'Not available',
                'Job Description': job_description or 'Not available',
                'Job Type': job_type or 'Not available',
                'Apply Link': apply_link or 'Not available',
                'Job Requirements': job_description or 'Not available'
            }

            print(job_details)


            
            return job_details
        
        except Exception as e:
            print(f"Detailed error scraping {job_url}: {e}")
            print(traceback.format_exc())
            return None

    # Get the cleaned job details HTML
    job_details_html = scrape_job_details(driver,job_url)

    if job_details_html:
        return JsonResponse({"job_component_html": job_details_html})
    else:
        return JsonResponse({"error": "Failed to scrape job details"}, status=500)