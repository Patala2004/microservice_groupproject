# pull official base image
FROM python:3.14.0-slim

# set work directory
WORKDIR /home/app/

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install deps needed for psycopg and image build
RUN apt-get update \
	&& apt-get install -y --no-install-recommends build-essential libpq-dev gcc libffi-dev libssl-dev \
	&& rm -rf /var/lib/apt/lists/*

RUN python3 -m pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt
WORKDIR /home/app/

# copy project
COPY . .

# Generate static files for admin / api interface
RUN python manage.py collectstatic --noinput