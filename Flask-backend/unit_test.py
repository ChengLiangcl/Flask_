import unittest
from app import app, db
import requests
from flask import request
import json
from flask.wrappers import Response

class TestClass(unittest.TestCase):
    def setup_class(self):
        app.config['TESTING'] = True  
        self.app = app.test_client()

    def teardown_class(self):
        """Do the testing """
        pass
    def test_login_sucessfully(self):
        data = {'username': '123@gmail.com', 'password': '12345678'}
        response = app.test_client().post('/login', data=json.dumps(data))
        self.assertEqual(response.data, b'"123@gmail.com"')
    def test_login_falied(self):
        data = {'username': 'jaypark@gmail.com', 'password': 'jayparkhlermusic'}
        response = app.test_client().post('/login', data=json.dumps(data))
        self.assertEqual(response.data, b'Invalid login credentials')

    def test_signup_sucessfully(self):
        data = {'password': '12345678', 'confirmpassword': '12345678', 'email': 'parkJae-beom@gmail.com',
            'question': 'What is your mother name', 'answer': 'Testing'}
        response = app.test_client().post('/sign-up', data=json.dumps(data))
        self.assertEqual(response.data, b'Add Sucessfully')
    def test_signup_falied(self):
        data = {'password': '12345678', 'confirmpassword': '12345678', 'email': 'parkJae-beom@gmail.com',
            'question': 'What is your mother name', 'answer': 'Testing'}
        response = app.test_client().post('/sign-up', data=json.dumps(data))
        self.assertEqual(response.data, b'username already exist')
        db.user.delete_one({"UserName": 'parkJae-beom@gmail.com'})

     

        




        
        
    
    # def test_login(self):
    #     response = self.app.get('/login')
    #     print(response)
    #     data = {'username': '123456@qq.com', 'password': '12345678'}
    #     response = app.test_client().post('/login', data=json.dumps(data))
    #     self.assertEqual(response.status_code, 200)
    #     print('--------------')
    #     self.assertEqual(response.text, "Invalid login credentials")
    #     # response = app.test_client().post('/login')
    #     # self.assertEqual(response.data, "Invalid login credentials")
    #     self.assertEqual(response, 'hello world!')
    



    # def test_sign(self):
    #     print('test sign')
    # url = "http://localhost:5000/sign-up"
    # data = {'password': '12345678', 'confirmpassword': '12345678', 'email': '123456@qq.com',
    #         'question': 'What is your mother name', 'answer': '111'}
    # data2 = {'password': '12345678', 'confirmpassword': '12345678', 'email': '741917776@qq.com',
    #             'question': 'What is your mother name', 'answer': '111'}
    # response = requests.post(url=url, data=json.dumps(data))
    # self.assertEqual(response.status_code, 200)
    # self.assertEqual(response.text, 'username already exist')
    # response = requests.post(url=url, data=json.dumps(data2))
    # self.assertEqual(response.text, 'Add Successfully')


 


