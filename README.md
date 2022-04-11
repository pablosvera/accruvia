# Accruvia Test Project

Coding assessment to test Pablo Vera's skills

## Installation

You only need to install the tech stack specified in the requirements documentation.

```bash
$ python -m pip install Django
$ python manage.py makemigrations poorManTwitter
$ python manage.py migrate
$ python manage.py runserver
```

## Project structure

Given the tech stack restrictions, I decided to avoid using the python cors package. The implication of this decision is that I had to keep the front and back projects all together.
I'm sure this is not best practice, but I decided to comply with the requirements.
I also decided not to include tests in the front end because of the same reasons. All testing frameworks would require an external package (npm or yarn).

## License

[Apache License 2.0](https://choosealicense.com/licenses/apache-2.0/)
