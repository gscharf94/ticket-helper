import os

import pickle
from flask import Flask

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY="dev",
        DATABASE=os.path.join(app.instance_path, 'flaskr.sqlite'),
    )

    if test_config is None:
        app.config.from_pyfile('config.py',silent=True)
    else:
        app.config.from_mapping(test_config)

    
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    @app.route('/display/<date>')
    def display(date):
        cwd = os.getcwd()
        response_path = f'{cwd}\\pickle_dump\\r{date}.p'
        work_id_path = f'{cwd}\\pickle_dump\\w{date}.p'

        response_dict = pickle.load(open(response_path,'rb'))
        work_id_path = pickle.load(open(work_id_path, 'rb'))

        return f'{str(response_dict)} -|- {str(work_id_path)}'


    return app