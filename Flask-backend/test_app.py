import unittest
from app import app
import requests
from flask import request
import json


class Testapp(unittest.TestCase):

    def setUp(self):
        print('start this test')

    def tearDown(self):
        print('end this test\n')

    def test_login(self):
        print('test login')
        url = "http://localhost:5000/login"
        data = {'username': '123456@qq.com', 'password': '12345678'}
        data2 = {'username': '123456@qq.com', 'password': '123456'}
        response = requests.post(url=url, data=json.dumps(data))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.text, json.dumps('123456@qq.com'))
        response = requests.post(url=url, data=json.dumps(data2))
        self.assertEqual(response.text, "Invalid login credentials")


    def test_sign(self):
        print('test sign')
        url = "http://localhost:5000/sign-up"
        data = {'password': '12345678', 'confirmpassword': '12345678', 'email': '123456@qq.com',
                'question': 'What is your mother name', 'answer': '111'}
        data2 = {'password': '12345678', 'confirmpassword': '12345678', 'email': '741917776@qq.com',
                 'question': 'What is your mother name', 'answer': '111'}
        response = requests.post(url=url, data=json.dumps(data))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.text, 'username already exist')
        response = requests.post(url=url, data=json.dumps(data2))
        self.assertEqual(response.text, 'Add Sucessfully')


if __name__ == '__main__':
    unittest.main()
