# How to run backend

You only need to do this once:

    export FLASK_APP=run.py
    (windows) set FLASK_APP=run.py
    export FLASK_ENV=development

    To install:
    pip install pyjwt

    pip install haversine
    pip install geocoder
    pip install itertools



From now you only have to do:

    flask run

Note: If you change anything regarding the structure of a table, first delete the table (in phpMyAdmin) and then ony "flask run".

## Fix for Error with login depending on your computer
In: crud/create.py line 53
Change to either 
- 'token':token
- 'token':token.decode('utf8') 