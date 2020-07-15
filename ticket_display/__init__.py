import os

import pickle
from flask import Flask
from flask_cors import CORS

def create_app(test_config=None):
    app = Flask(__name__, instance_relative_config=True)
    CORS(app)
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
        work_id = pickle.load(open(work_id_path, 'rb'))

        for work_id_num in response_dict:
            for ticket_num in response_dict[work_id_num]:
                for x, row in enumerate(response_dict[work_id_num][ticket_num]):
                    for y, item in enumerate(row):
                        response_dict[work_id_num][ticket_num][x][y] = item.replace(",","")
                        if item.replace(",","") == "No Response Current":
                            response_dict[work_id_num][ticket_num][x][y] = "No Response"
                        if 'gray-primary-text">Respondant' in item:
                            response_dict[work_id_num][ticket_num][x][y] = "PRAC"
                        if y == 2:
                            if item.find("-") != -1:
                                response_dict[work_id_num][ticket_num][x][y] = item[:item.find("-")-1]
                

        work_ids = []
        for item in work_id:
            work_ids.append(int(item))

        return f'{str(response_dict)} xyzxyz {str(work_id)} abcabc {str(work_ids)}'


    return app