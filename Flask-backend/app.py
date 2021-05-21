from flask import Flask, flash, jsonify, request, render_template, make_response, redirect, url_for, abort, session, g
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
from flask_restful import Api, Resource, reqparse
import os
import json
import pymongo
from bson.json_util import dumps
from bson.json_util import loads
from bson import json_util
from passlib.hash import pbkdf2_sha256
import uuid
import random
import pandas as pd
import numpy as np
import csv
import time
import re
# import xlrd
# import openpyxl
files_size = 0
file_num = 0
client = pymongo.MongoClient(
    "mongodb://123:123@cluster0-shard-00-00.nspcw.mongodb.net:27017,cluster0-shard-00-01.nspcw.mongodb.net:27017,cluster0-shard-00-02.nspcw.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-k7vjf4-shard-0&authSource=admin&retryWrites=true&w=majority",
    ssl=True, ssl_cert_reqs='CERT_NONE')
db = client.datasets
app = Flask(__name__)
app.secret_key = b'pj&\xe9\xd7\xd7\xabc\xe6KX\xbe\x9f<\x9f\x87'
app.config['UPLOAD_PATH'] = 'public'  # to create a folder which is used to save the uploaded file
CORS(app)

'''
Datasets and model upload
'''
@app.route('/connect-upload', methods=["POST"])
@cross_origin()
def connect_upload():
    index=0
    outputerrors = ""
    # get username
    userName = request.files['username'].filename
    print("connect username: ", userName)
    print("-------------------------------------")
    print("get file: ", request.files)
    print("-------------------------------------")
    #get model
    model = request.files['model']
    model_name = request.files['model'].filename
    # save th modle into the public folder
    # please remember to check the repeated model name
    model.save(os.path.join(app.config['UPLOAD_PATH'], model_name))
    print("model: ", model)
    print("model name:", model_name)
    print("--------------------------------------")
    uuid_combined = uuid.uuid4().hex
    print(uuid_combined)
    #get the file size
    size = os.path.getsize(os.path.join(app.config['UPLOAD_PATH'], model_name))
    size = str(size/1000) + "KB"
    output = open(os.path.join(app.config['UPLOAD_PATH'], model_name),'r')
    data = output.readlines()
    count = 0
    for i in data:
        count = count +1
        if(count==1):
            if(len(i.split(' '))==1):
                2/0
        break


        
    output.close()
    # file name checking
    split_name = model_name.split(".")
    modelsuffix = split_name[len(split_name)-1]
    

    if  modelsuffix!= "cod":
        print("find Exception")
        raise ValueError
    
    if len(list(db.models.find({"UserName":userName,"FileName" :{'$regex' :model_name}})))>0:
        name_size = list(db.models.find({"UserName":userName, "FileName" :{'$regex' :model_name}},{"copy":1,"_id":0}))
        name_size = name_size[len(name_size)-1].get('copy') + 1
        print(name_size)
        print('duplicated')
        newmodel_name =  'copy' + '('+ str(name_size) + ')' + '_' + model_name
        Array = ["System have successfully add model ",model_name," ,because already exist the same model name, system automatically change to ",newmodel_name,"\n"]
        outputerrors =outputerrors.join(Array)
        print(outputerrors)
        store_schema = {
            "uuid":uuid_combined,
            "FileName": newmodel_name,
            "BriefInfo": "",
            "Size": size,
            "UserName": userName,
            "data": data,
            "copy" : name_size
        }
        db.models.insert_one(store_schema)
    else:
        Array = ["System have successfully add model ", model_name,"\n"]
        outputerrors = outputerrors.join(Array)
        print(outputerrors)
        store_schema = {
            "uuid":uuid_combined,
            "FileName": model_name,
            "BriefInfo": "",
            "Size": size,
            "UserName": userName,
            "data": data,
            "copy":0
        }
        db.models.insert_one(store_schema)
   
    
   #--------------------------Finish Model Uploading--------------------------------------------------------------------
    # get files list: multiple files are stored into an list
    files_list = [request.files['file'+str(i)] for i in range(0, len(request.files)-2)]
    print("file list is: ", files_list)
    print("file len is", len(files_list))
    session['uploaded_datasets_len'] = len(files_list)
    print("len is: ", session['uploaded_datasets_len'])
    print("check seesion: ",  session.items())
    

    # when a user only upload a model, then the file_list is []
    # please return a [""] file_name_list to the frontend

    if (len(files_list) != 0):
        # get the first file
        print("the first file: ", files_list[0])
        # get file-name list
        files_name_list = [secure_filename(request.files['file'+str(i)].filename) for i in range(0, len(request.files)-2)]
        print("file name list ", files_name_list) # ['ex.dat', 'ex_fdy.dat', 'ex_fts.dat']

        # check if the post request has the file part
        # if user does not select file browser also
        # submit an empty part without filename
        global files_size
        global file_num
        files_size = len(files_list)
        for uploaded_file in files_list:
            if uploaded_file.filename == '':
                flash('No selected file')
                return redirect(request.url)

        # PLEASE deal with the filename to avoid repeating name here
        # file_ext = os.path.splitext(filename)[1] # get extenson of a file, like .csv
        # (replace the code below) save the file to MongoDB

        # initial two Array to A store valid file name B store invalid file
        A = []
        B = []

        for uploaded_file in files_list:
         try:
            uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename))

            # to get the column number

            f = open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r')
            first_line = f.readline()
            if(len(first_line.strip().split(' '))>1 and ' ' in first_line ):
                print('INTRO')
                print(first_line.strip().split(' ')[1])
                if(first_line.strip().split(' ')[1].isdigit()==False):
                    2/0
                sizes = len(first_line.strip().split(' '))
            elif(',' in first_line):
                sizes = len(f.readline().split(','))
                print('do here mother fucker')
                print(sizes)
            elif(' ' in first_line and len(first_line.strip().split(' '))==1 ):
                print('cool')
                sizes = [len(line.rstrip().split(' ')) for line in f.readlines()[1:2]][0]
            else:
                sizes = [len(line.rstrip().split(' ')) for line in f.readlines()[1:2]][0]
            
            columnNames = [''] * sizes
            attributes_meta = sizes
            
            # file name checking
            dataset_name = uploaded_file.filename
            split_name = dataset_name.split(".")
            modelsuffix = split_name[len(split_name) - 1]

            if modelsuffix not in ["dat","txt","csv","xlsx"]:
                # if name is not include, throw an exception
                raise ValueError

            for i in range(sizes):
                columnNames[i] = "Coloumn" + " " + str(i)
            record = 0
            path_str_first = './public/' + str(index) + '.'+'dat'
            with open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r') as f:
                with open(path_str_first,'w') as f1:
                    f1.write(','.join(columnNames)+"\n")
                    next(f) # skip the first line of the dataset
                    for line in f:
                        lines =str(line)
                        lines = lines.split(" ")
                        f1.write(','.join(lines))
                        record = record + 1
            instance_meta = record
            index = index + 1

         except ValueError as e:
            # catch exception, store it in B array
            print(e)
            B.append(uploaded_file)
         else:
            # if no exception, store it in A array
            A.append(uploaded_file)

        A = A + B # Merge two array
        for uploaded_file in A:
            # to get the column number

            f = open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r')
            size = [len(line.rstrip().split(' ')) for line in f.readlines()[1:2]][0]

            columnNames = [''] * sizes
            attributes_meta = sizes
            # file name checking
            dataset_name = uploaded_file.filename
            split_name = dataset_name.split(".")
            modelsuffix = split_name[len(split_name) - 1]
            print("EXCEPTION")
            if modelsuffix not in ["dat","txt","csv","xlsx"]:
                raise ValueError

            for i in range(size):
                columnNames[i] = "Coloumn" + " " + str(i)
            record = 0
            path_str = './public/' + str(index) + '.'+'dat'
            with open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r') as f:
                with open(path_str,'w') as f1:
                    f1.write(','.join(columnNames)+"\n")
                    next(f) # skip the first line of the dataset
                    for line in f:
                        lines =str(line)
                        lines = lines.split(" ")
                        f1.write(','.join(lines))
                        record = record + 1
            instance_meta = record
            index = index + 1
            data = pd.read_csv(path_str)
            data = data.to_dict('records')
            size = os.path.getsize(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename))
            size = str(size/1000) + "KB"


            if len(list(db.files.find({"UserName":userName,"FileName":{'$regex' :uploaded_file.filename}})))>0:
                name_size = list(db.files.find({"UserName":userName, "FileName" :{'$regex' :uploaded_file.filename}},{"copy":1,"_id":0}))           
                name_size = name_size[len(name_size)-1].get('copy') + 1
                FileName=  'copy' + '('+ str(name_size) + ')' + '_' + uploaded_file.filename
                outputerrors = outputerrors + "".join(Array)
                store_schema={
                    "uuid":uuid_combined,
                    "FileName":FileName,
                    "BriefInfo":"",
                    "Size": size,
                    "Description": "",
                    "Source": "",
                    "Number_of_Attribute": attributes_meta,
                    "Number_of_Instance": instance_meta,
                    "Keywords": [],
                    "AttrInfo": [

                        {
                            "attrName": "",
                            "attrDescription": ""
                        }
                    ],
                    "UserName":userName,
                    "data": data,
                    "copy":name_size
                }

                db.files.insert_one(store_schema)

            else:

                store_schema={
                    "uuid":uuid_combined,
                    "FileName":uploaded_file.filename,
                    "BriefInfo": "",
                    "Size": size,
                    "Description": "",
                    "Source": "",
                    "Number_of_Attribute": attributes_meta,
                    "Number_of_Instance": instance_meta,
                    "Keywords": [],
                    "AttrInfo": [

                        {
                            "attrName": "",
                            "attrDescription": ""
                        }
                    ],
                    "UserName":userName,
                    "data": data,
                    "copy":0
                }
                db.files.insert_one(store_schema)
            file_num = file_num + 1
        return json.dumps([model_name, files_name_list])

    files_name_list = [""]
    return json.dumps([model_name, files_name_list])

'''
Datasets
'''
@app.route('/upload', methods=["GET", "POST"])
@cross_origin()
def upload():
    file_name_list = list()
    index = 0
    uuid_combined = uuid.uuid4().hex
    if request.method == "POST":
        userName = request.files['username'].filename
        print("get username: ", userName)

        # TODO： 这是得到多个datasets的代码
        # get files list: multiple files are stored into an list
        files_list = [request.files['file'+str(i)] for i in range(0, len(request.files)-1)]
        print("file list is: ", files_list)

        # get the first file
        print("the first file: ", files_list[0])
        # get file-name list
        files_name_list = [secure_filename(request.files['file'+str(i)].filename) for i in range(0, len(request.files)-1)]
        print("file name list ", files_name_list) # ['ex.dat', 'ex_fdy.dat', 'ex_fts.dat']
        global files_size
        global file_num
        files_size = len(files_name_list)
        
        for uploaded_file in files_list:
            if uploaded_file.filename == '':
                flash('No selected file')
                return redirect(request.url)
        A = []
        B = []
        for uploaded_file in files_list:
         try:
            uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename))
           # to get the column number
            f = open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r')
            first_line = f.readline()
            if(len(first_line.strip().split(' '))>1 and ' ' in first_line ):
                print('INTRO')
                print(first_line.strip().split(' ')[1])
                if(first_line.strip().split(' ')[1].isdigit()==False):
                    2/0
                sizes = len(first_line.strip().split(' '))
            elif(',' in first_line):
                sizes = len(f.readline().split(','))
                print('do here mother fucker')
                print(sizes)
            elif(' ' in first_line and len(first_line.strip().split(' '))==1 ):
                print('cool')
                sizes = [len(line.rstrip().split(' ')) for line in f.readlines()[1:2]][0]
            else:
                sizes = [len(line.rstrip().split(' ')) for line in f.readlines()[1:2]][0]

            
            columnNames = [''] * sizes
            attributes_meta = sizes
            # file name checking
            dataset_name = uploaded_file.filename
            split_name = dataset_name.split(".")
            modelsuffix = split_name[len(split_name) - 1]
            if modelsuffix not in ["dat","txt","csv","xlsx"]:
                raise ValueError

            for i in range(sizes):
                columnNames[i] = "Coloumn" + " " + str(i)
            print(columnNames)
            record = 0
            path_str_first = './public/' + str(index) + '.'+'dat'
            with open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r') as f:
                with open(path_str_first,'w') as f1:
                    f1.write(','.join(columnNames)+"\n")
                    next(f) # skip the first line of the dataset
                    for line in f:
                        lines =str(line)
                        lines = lines.split(" ")
                        f1.write(','.join(lines))
                        record = record + 1
            index = index + 1
         except ValueError as e:
            print(e)
            B.append(uploaded_file)
         else:
            A.append(uploaded_file)
        A = A + B

        for uploaded_file in A:

            # to get the column number
            f = open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r')
            size = [len(line.rstrip().split(' ')) for line in f.readlines()[1:2]][0]
            columnNames = [''] * sizes
            attributes_meta = sizes
            # file name checking
            dataset_name = uploaded_file.filename
            split_name = dataset_name.split(".")
            modelsuffix = split_name[len(split_name) - 1]
            print("EXCEPTION")
            if modelsuffix not in ["dat","txt","csv","xlsx"]:
                raise ValueError

            for i in range(size):
                columnNames[i] = "Coloumn" + " " + str(i)
            record = 0
            index = index + 1
            path_str = './public/' + str(index) + '.'+'dat'
            with open(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename),'r') as f:
                with open(path_str,'w') as f1:
                    f1.write(','.join(columnNames)+"\n")
                    next(f) # skip the first line of the dataset
                    for line in f:
                        lines =str(line)
                        lines = lines.split(" ")
                        f1.write(','.join(lines))
                        record = record + 1
            instance_meta = record
            data = pd.read_csv(path_str_first)
           
            data = data.to_dict('records')
            size = os.path.getsize(os.path.join(app.config['UPLOAD_PATH'], uploaded_file.filename))
            size = str(size/1000) + "KB"
            print(len(list(db.files.find({"UserName":userName,"FileName":{'$regex' :uploaded_file.filename}}))))
            if len(list(db.files.find({"UserName":userName,"FileName":{'$regex' :uploaded_file.filename}})))>0:
                name_size = list(db.files.find({"UserName":userName, "FileName" :{'$regex' :uploaded_file.filename}},{"copy":1,"_id":0}))
                copy_size = name_size[len(name_size)-1].get('copy')+1
                FileName=  'copy' + '('+ str(copy_size) + ')' + '_' + uploaded_file.filename 

                file_name_list.append(FileName)
                store_schema={
                    "uuid":uuid_combined,
                    "FileName":FileName,
                    "BriefInfo":"",
                    "Size": size,
                    "Description": "",
                    "Source": "",
                    "Number_of_Attribute": attributes_meta,
                    "Number_of_Instance": instance_meta,
                    "Keywords": [],
                    "AttrInfo": [

                        {
                            "attrName": "",
                            "attrDescription": ""
                        }
                    ],
                    "UserName":userName,
                    "data": data,
                    "copy":copy_size

                }


                db.files.insert_one(store_schema)
            else:

                store_schema={
                    "uuid":uuid_combined,
                    "FileName":uploaded_file.filename,
                    "BriefInfo": "",
                    "Size": size,
                    "Description": "",
                    "Source": "",
                    "Number_of_Attribute": attributes_meta,
                    "Number_of_Instance": instance_meta,
                    "Keywords": [],
                    "AttrInfo": [

                        {
                            "attrName": "",
                            "attrDescription": ""
                        }
                    ],
                    "UserName":userName,
                    "data": data,
                    "copy":0
                }

                file_name_list.append(uploaded_file.filename)
                db.files.insert_one(store_schema)
            file_num = file_num + 1
    return json.dumps(file_name_list)

@app.route('/datasetFiles', methods=["POST"])
def showMyDatasets():
    UserName = request.get_json(force=True)
    print("username get: ", UserName)
    # read datasets JSON file
    # TODO: You should get the same format of (_id, FileName, Size) from MongoDB, then replace it
    # TODO: return a empty [] to me if there is no file in the MongoDB
    data_return = list(db.files.find( {"UserName":UserName},{"AttrInfo":0,"Keywords":0,"uuid":0,"data":0,"copy":0}))
    model_uuid = list(db.files.find( {"UserName":UserName},{"uuid":1,"_id":0}))
    model_name = list()
  
    # print(model_uuid[0].get('uuid'))
    for i in model_uuid:
        models = list(db.models.find( {"uuid":i.get('uuid')},{'FileName':1,'_id':0}))
        
        if(len(models)==0):
            model_name.append('')
        else:
            model_name.append(models[0])
  

   
    if(len(data_return)!=0):
        for i in range (len(data_return)):
            if(model_name[i]!=""):
                data_return[i]['ModelName'] = model_name[i].get('FileName')
            else:
                data_return[i]['ModelName'] = ""

        json_data = dumps(data_return, indent = 2)
   
        with open('./showAlldatasetFiles.json', 'w') as file:
            file.write(json_data)
       
        values = json.loads(json_data)
        values = dumps(values, indent = 2)
        return values

    else:
        data = []
        return json.dumps(data)

@app.route('/newDataset', methods=["POST"])
def sendNewdatasetFiles():
    # TODO: (replace the code below) get the uploaded dataset from MongoDB with _id, FileName, Size
    # because frontend cannot show the new file until it is saved into the MongoDB, and frontend cannot generate _id itself
    # Here, I'll create a uploaded file JSON myself, please delete it when you finish this TODO
    #uploaded_size = session['uploaded_datasets_len']
    username = request.get_json(force=True)
    print("username for new datasets: ", username)

    print("get session", session.items())
    global files_size
    global file_num
    print('-----------------------------')
    print(files_size)
    print(file_num)
    print('-----------------------------')
    print("The taotal number of files: " + str(files_size))
    data = db.files.find({"UserName":username},{"data":0,"uuid":0}).sort('_id',-1).limit(file_num)
    json_data = dumps(data, indent = 2)
    with open('./dataNewJson.json', 'w') as file:
                file.write(json_data)
    jsonFile = open('./dataNewJson.json', 'r')
    values = json.load(jsonFile)
    # print(values)
    file_num = file_num - file_num
    return json.dumps(values)

@app.route('/submit-metadata', methods=["POST"])
@cross_origin()
def submitMetadata():
    metadata = request.get_json(force=True)
    FileName = metadata[0]["FileName"]
    UserName = metadata[0]["UserName"]
    BriefInfo = metadata[0]["BriefInfo"]
    Description = metadata[0]["Description"]
    Source = metadata[0]["Source"]
    Keywords = metadata[0]["Keywords"]
    AttrInfo = metadata[0]["AttrInfo"]
    db.files.update_one({"UserName": UserName,"FileName":FileName},
        {"$set": {
            "BriefInfo": BriefInfo,
            "Description": Description,
            "Source":Source,
            "Keywords":Keywords,
            "AttrInfo":AttrInfo
            }}
            ) 
    metadata_string = request.data

    # TODO save the metadata into MongoDB

    # this return must be string, which will be returned to the frontend immediately
    # so DO NOT modify the return 'metadata_string'
    return metadata_string


# to delete the selected dataset
@app.route('/delete-dataset', methods=["POST"])
@cross_origin()
def deleteOneDataset():
    dataset_userName = request.get_json(force=True)
    datasetName= dataset_userName[0]
    userName = dataset_userName[1]
    # TODO delete the corresponding dataset in the MongoDB based on the datasetName
    # delete corresponding dataset
    db.files.delete_one({"UserName": userName, "FileName": datasetName})
    # this return must be string, which will be returned to the frontend immediately
    # so DO NOT modify the return 'metadata_string'
    return datasetName


# to receive the selected dataset name for getting corresponding detailed data and metadata
@app.route('/detailedData-name', methods=["POST"])
@cross_origin()
def getNameForDetailedData():
    dataset_userName = request.get_json(force=True)
    datasetName= dataset_userName[0]
    userName = dataset_userName[1]
    print("detailed data: ", datasetName)
    print("detailed data: ", userName)
    result = db.files.find({"FileName":str(datasetName),"UserName":str(userName)})
    result = loads(dumps(result))

    if(len(result)>0):
        # TODO to get detailed_data from MongoDB
        result = db.files.find({"FileName":str(datasetName),"UserName":str(userName)},{"_id":0,"uuid":0})
        result = loads(dumps(result))
        metadata = result
        detailed_data = metadata[0]['data']
    return json_util.dumps([detailed_data, metadata])

# to query datasets based on the dataset name or key words
@app.route('/query-datasets', methods=["POST"])
@cross_origin()
def queryDatasets():
    # you will recieve a inputted word by a user from the frontend
    input_value_username = request.get_json(force=True)
    input_value = input_value_username[0]
    UserName = input_value_username[1]
    onesearch = [] #one search result
    List = [] # two-dimensional array
    if '&&' in input_value:
     inputarray = str(input_value).split("&&")
     for element in inputarray:
      data_return=list(db.files.find({"$and":[{"UserName": UserName},
    {"$or":[{"BriefInfo":{ "$regex":element,"$options":"$i"}},
    {"Label":{ "$regex":element,"$options":"$i"}},
    {"FileName":{ "$regex":element,"$options":"$i"}},
    {"Description":{ "$regex":element,"$options":"$i"}},
    {"Source":{ "$regex":element,"$options":"$i"}},
    {"Keywords":{"$regex":element,"$options":"$i"}},
    {"AttrInfo":{ "$regex":element,"$options":"$i"}}]}]},{"_id":0}))
      data = loads(dumps(data_return))
      lenth = len(data)
      for i in range(lenth):
       onesearch.append(data[i]['FileName'])
      List.append(onesearch)
      onesearch = []
     print("XXXXX")
     print(List)
     if len(List) > 1:
      result = List[0]
      for i in range(1,len(List)):
       result = list(set(result).intersection(set(List[i])))
       print(result)
     elif len(List) == 1:
         result = List[0]
     else:
         result = []

    elif '||' in input_value:
        inputarray = str(input_value).split("||")
        for element in inputarray:
            data_return = list(db.files.find({"$and": [{"UserName": UserName},
            {"$or": [{"BriefInfo": {"$regex": element, "$options": "$i"}},
            {"Label": {"$regex": element, "$options": "$i"}},
            {"FileName": {"$regex": element, "$options": "$i"}},
            {"Description": {"$regex": element, "$options": "$i"}},
            {"Source": {"$regex": element, "$options": "$i"}},
            {"Keywords": {"$regex": element, "$options": "$i"}},
            {"AttrInfo": {"$regex": element, "$options": "$i"}}]}]},{"_id": 0}))
            data = loads(dumps(data_return))
            lenth = len(data)
            for i in range(lenth):
             onesearch.append(data[i]['FileName'])
            List.append(onesearch)
            onesearch = []
        print("XXXXX")
        print(List)
        result = List[0]
        for onerow in List:
         result = list(set(result).union(set(onerow)))
         print(result)

    else:
        data_return = list(db.files.find({"$and": [{"UserName": UserName},
         {"$or": [{"BriefInfo": {"$regex": input_value, "$options": "$i"}},
         {"Label": {"$regex": input_value, "$options": "$i"}},
         {"FileName": {"$regex": input_value, "$options": "$i"}},
         {"Description": {"$regex": input_value, "$options": "$i"}},
         {"Source": {"$regex": input_value, "$options": "$i"}},
         {"Keywords": {"$regex": input_value, "$options": "$i"}},
         {"AttrInfo": {"$regex": input_value, "$options": "$i"}}]}]},
                                         {"_id": 0}))
        data = loads(dumps(data_return))
        lenth = len(data)
        result = []
        for i in range(lenth):
         result.append(data[i]['FileName'])

    print("-----------")
    print(result)

    data_return = list(db.files.find({"UserName": UserName,"FileName":{"$in":result}},{"_id":0}))
    if (len(data_return) != 0):
        json_data = dumps(data_return, indent=2)
        with open('./queryResultsForDatasets.json', 'w') as file:
            file.write(json_data)
        jsonFile = open('./queryResultsForDatasets.json', 'r')
        values = json.load(jsonFile)
        values = dumps(values, indent=2)
        with open('./queryResultsForDatasets.json', 'w') as file:
            file.write(values)
        return values
    else:
     print("The user does not have any file")
     data = []
    return json.dumps(loads(dumps(data)))

# to query datasets based on the dataset name or key words
@app.route('/downloader', methods=["POST"])
@cross_origin()
def downloadFile():
    # get dataset name that needs to be downloaded and username
    dataset_userName = request.get_json(force=True)
    datasetName= dataset_userName[0]
    userName = dataset_userName[1]
    downloadType= dataset_userName[2]
    print("downloaded dataset name： %s, username: %s, dowloadType: %s" %(datasetName, userName, downloadType))
    data = db.files.find({"UserName":userName,"FileName":datasetName},{"_id":0,"data":1})
    result = db.files.find({"FileName":str(datasetName),"UserName":str(userName)},{"_id":0,"uuid":0})
    result = loads(dumps(result))
    metadata = result
    data = metadata[0]['data']
   
    
    data_list = list()
    size = len(data[0])

    print(size)
    for i in data:
        tem = list()
        for j in range(size):
            key = 'Coloumn ' + str(j)
            tem.append(i.get(key))
        data_list.append(tem)
    # print(data_list)

    data_list =  np.asarray(data_list)
    df = pd.DataFrame(data_list)
    df.to_csv('./download/tem_data.csv', sep = ' ',index=False)
    # deal with data based on the download type here

    # read file
    # text format
    if downloadType == '.txt':
        with open('./download/tem_data.csv') as f:
            content = f.read()
    elif downloadType == '.dat':
        with open('./download/tem_data.csv') as f:
            lines = f.readlines()
        lines[0] = str(size) + '\n'
        print('----------')
        print(lines[0])
        print('-------------')
        with open("./download/tem_data.txt", "w") as f:
            f.writelines(lines)
        with open('./download/tem_data.txt') as f:
            content = f.read()
        

        
         
    #  csv
    elif downloadType == '.csv':
        f = open('./download/tem_data.csv')
        first_line = f.readline().replace('\n','')
        lines = f.readlines()
        header = first_line.split(' ')
        print(header)
        format_result = list()
        for i in lines:
            i = i.replace('\n','')
            tem_list = i.split(' ')
            row_result = {header[i]: tem_list[i] for i in range(len(header))}
            format_result.append(row_result)
        import csv
        class CsvTextBuilder(object):
            def __init__(self):
                self.csv_string = []

            def write(self, row):
                self.csv_string.append(row)
        csvfile = CsvTextBuilder()
        fieldnames = header
        writer = csv.DictWriter(csvfile, fieldnames)
        writer.writeheader()
        writer.writerows(format_result)
        content = ''.join(csvfile.csv_string)
    
    print(content)
    return content

'''
Models
'''
@app.route('/modelFiles', methods=["POST"])
@cross_origin()
def showMyModelFiles():
    # read datasets JSON file
    # TODO: You should get the same format of (_id, FileName, Size) from MongoDB, then replace it
    # TODO: return a empty [] to me if there is no file in the MongoDB
    UserName = request.get_json(force=True)
    data_return = list(db.models.find({"UserName": UserName},{"data":0}))
    print(len(data_return))
    if (len(data_return) != 0):
        json_data = dumps(data_return, indent=2)
        values = json.loads(json_data)
        values = dumps(values, indent=2)
        return values
    else:
        print("The user does not have any file")
        data = []
        return json.dumps(data)

@app.route('/upload-model', methods=["GET", "POST"])
@cross_origin()
def uploadModel():
    if request.method == "POST":
        #userName = request.files['username']
        userName = request.files['username'].filename
        print(userName)
        # check if the post request has the file part
        if 'file' not in request.files:
            flash("No file part")
            return redirect(request.url)

        uploaded_file = request.files['file']
        print(uploaded_file)
        # if user does not select file browser also
        # submit an empty part without filename
        if uploaded_file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        # check if the post request has the file part
        filename = secure_filename(uploaded_file.filename)
        print(filename)  # e.g. ex.csv
        # TODO: PLEASE deal with the filename to avoid repeating name here
        file_ext = os.path.splitext(filename)[1]  # get extenson of a file, like .csv
        uploaded_file.save(os.path.join(app.config['UPLOAD_PATH'], filename))
        # Get the path of the file
        paths = os.path.join(app.config['UPLOAD_PATH'], filename)
        # Get the size of the file
        size = os.path.getsize(paths)
        size_string = str(size / 1000) + "KB"
        print(size_string)
        ID = userName
        print(ID)
        newf = paths
        print(newf)
        f = open(newf)
        lines = f.readlines()
        # copy the content in lines to new list named data
        count =0
        for i in lines:
            count = count+1
            if(count ==1):
                tem = i.split(' ')[1]
                print('------')
                print(tem)
                print('guichuang')
            
            
        data = lines
        Array = filename.split('.', 1)
        filename = Array[0] + ".cod"
        results = db.models.find({"FileName": filename, "UserName": userName})
        for result in results:
            while (result["FileName"] == filename):
                Prefix = "copy_of_"
                filename = Prefix + str(random.randint(100, 999)) + filename
                print(filename)
        store_schema = {
            "FileName": filename,
            "BriefInfo": "",
            "Size": size_string,
            "UserName": ID,
            "data": data
        }

        db.models.insert_one(store_schema)

        return json.dumps(filename)


@app.route('/newModel', methods=["POST"])
def sendNewModelFiles():
    # TODO: (replace the code below) get the uploaded dataset from MongoDB with _id, FileName, Size
    # because frontend cannot show the new file until it is saved into the MongoDB, and frontend cannot generate _id itself
    # Here, I'll create a uploaded file JSON myself, please delete it when you finish this TODO
    username = request.get_json(force=True)
    print("username for new model: ", username)

    data = db.models.find().sort('_id', -1).limit(1)  # Find the newest data to insert
    json_data = dumps(data, indent=2)
    with open('./modeldataNewJson.json', 'w') as file:
        file.write(json_data)

    jsonFile = open('./modeldataNewJson.json', 'r')
    values = json.load(jsonFile)
    for element in values:
        if 'data' in element:
            del element['data']
            break
    values = dumps(values, indent=2)
    with open('./modeldataNewJson.json', 'w') as file:
        file.write(values)
    jsonFile = open('./modeldataNewJson.json', 'r')
    values = json.load(jsonFile)

    return json.dumps(values)


@app.route('/delete-model', methods=["POST"])
@cross_origin()
def deleteOneModel():
    model_userName = request.get_json(force=True)
    print(model_userName)
    modelName = model_userName[0]
    userName = model_userName[1]

    # delete corresponding dataset
    db.models.delete_one({"UserName": userName, "FileName": modelName})
    return modelName


@app.route('/edit-model-desc', methods=["POST"])
@cross_origin()
def editModelDescription():

    data = request.get_json(force=True)

    print("This is add Model Description")

    print(data)
    ModelName = data["modelName"]
    print(ModelName)
    Description = data["description"]
    userName = data["userName"]
    print(userName)
    db.models.update_one({"UserName":userName,"FileName":ModelName},{"$set":{"BriefInfo":Description}})

    return data["modelName"]


'''
Users
'''
@app.route('/login', methods=["POST"])
@cross_origin()
def login():
    data = request.get_json(force=True)
    print(data)
    user = db.user.find_one({
        "UserName": request.get_json(force=True)['username']
    })
    print(user)
    if user and pbkdf2_sha256.verify(request.get_json(force=True)['password'], user['password']):
        del user['password']
        session['login'] = True
        session['user'] = user
        print('Login Sucessfully')
        return json_util.dumps(user["UserName"])
    else:
        return "Invalid login credentials"

    # success = True
    # if success:
    #     return json_util.dumps(data)
    # else:
    #     return ""

@app.route('/sign-up', methods=["POST"])
@cross_origin()
def signUp():
    data = request.get_json(force=True)
    user = {
        "_id": uuid.uuid4().hex,
        "password": request.get_json(force=True)['password'],
        "UserName": request.get_json(force=True)['email'],
        "question": request.get_json(force=True)['question'],
        "answer": request.get_json(force=True)['answer'],
    }
    user['password'] = pbkdf2_sha256.encrypt(user['password'])
    print(data)
    if db.user.find_one({"UserName": user['UserName']}):
        print('username already exist')
        return 'username already exist'
    else:
        db.user.insert_one(user)
        print('The user add sucessfully')
        return 'Add Sucessfully'

@app.route('/passwordChange', methods=["POST"])
@cross_origin()
def passwordChange():
    data = request.get_json(force=True)
    print(data)
    success=True
    question = request.get_json(force=True)['question']
    answer = request.get_json(force=True)['answer']
    user = request.get_json(force=True)['username']
    password = request.get_json(force=True)['password']

    db.user.find({})
    if len(list(db.user.find({"UserName":user})))>0:
        user_list = list(db.user.find({"UserName":user},{"question":1,"answer":1}))
        print(user_list[0].get('question'))
        if(user_list[0].get('question')==question and user_list[0].get('answer')==answer):
            password = pbkdf2_sha256.encrypt(password)
            db.user.update_one({"UserName":user},{ "$set": { "password": password } })
            print("change successfully")
            return 'change successfully'
        else:
            print("Update Failed,the question or answer does not match")
            return "Update Failed, the question or answer does not match"

    else:
        print('The user does not exist')
        return "UserName deos not exist"
        # return 'Answers do not match'


@app.route('/bind-model', methods=["POST"])
@cross_origin()
def bind_model():
    model_userName_datasetName = request.get_json(force=True)
    print("binding:", model_userName_datasetName)
    modelName = model_userName_datasetName[0]
    userName = model_userName_datasetName[1]
    datasetName = model_userName_datasetName[2]
    #TODO: 1. fine the uuid of the model 
    #TODO: 2. set the uuid to the dataset
    returndata=db.models.find_one({"UserName":userName,"FileName":modelName})
    data=json.loads(dumps(returndata))
    print(data["uuid"])
    uuidofmodel=str(data["uuid"])
    db.files.update_one({"UserName":userName,"FileName":datasetName},{"$set":{"uuid":uuidofmodel}})
    return "Bind success"

@app.route('/query-models', methods=["POST"])
@cross_origin()
def query_model():
    # you will recieve a inputted word by a user from the frontend
    input_value_username = request.get_json(force=True)
    input_value = input_value_username[0]
    UserName = input_value_username[1]
    onesearch = []  # one search result
    List = []  # two-dimensional array
    if '&&' in input_value:
        inputarray = str(input_value).split("&&")
        for element in inputarray:
            data_return = list(db.models.find({"$and": [{"UserName": UserName},
            {"$or": [{"BriefInfo": {"$regex": element, "$options": "$i"}},
            {"FileName": {"$regex": element, "$options": "$i"}}]}]},{"_id": 0}))
            data = loads(dumps(data_return))
            lenth = len(data)
            for i in range(lenth):
                onesearch.append(data[i]['FileName'])
            List.append(onesearch)
            onesearch = []
        print("XXXXX")
        print(List)
        if len(List) > 1:
            result = List[0]
            for i in range(1, len(List)):
                result = list(set(result).intersection(set(List[i])))
                print(result)
        elif len(List) == 1:
            result = List[0]
        else:
            result = []

    elif '||' in input_value:
        inputarray = str(input_value).split("||")
        for element in inputarray:
            data_return = list(db.models.find({"$and": [{"UserName": UserName},
            {"$or": [{"BriefInfo": {"$regex": element, "$options": "$i"}},
            {"FileName": {"$regex": element,"$options": "$i"}}]}]}, {"_id": 0}))
            data = loads(dumps(data_return))
            lenth = len(data)
            for i in range(lenth):
                onesearch.append(data[i]['FileName'])
            List.append(onesearch)
            onesearch = []
        print("XXXXX")
        print(List)
        result = List[0]
        for onerow in List:
            result = list(set(result).union(set(onerow)))
            print(result)

    else:
        data_return = list(db.models.find({"$and": [{"UserName": UserName},
        {"$or": [{"BriefInfo": {"$regex": input_value, "$options": "$i"}},
        {"FileName": {"$regex": input_value, "$options": "$i"}}]}]},{"_id": 0}))
        data = loads(dumps(data_return))
        lenth = len(data)
        result = []
        for i in range(lenth):
            result.append(data[i]['FileName'])

    print("-----------")
    print(result)

    data_return = list(db.models.find({"UserName": UserName, "FileName": {"$in": result}}, {"_id": 0}))
    if (len(data_return) != 0):
        json_data = dumps(data_return, indent=2)
        with open('./queryResultsForModels.json', 'w') as file:
            file.write(json_data)
        jsonFile = open('./queryResultsForModels.json', 'r')
        values = json.load(jsonFile)
        values = dumps(values, indent=2)
        with open('./queryResultsForModels.json', 'w') as file:
            file.write(values)
        return values
    else:
        print("The user does not have any file")
        data = []
    return json.dumps(data)

@app.route('/get-bindedDatasets', methods=["POST"])
@cross_origin()
def query_binded_datasets():
    modelname_username = request.get_json(force=True)
    modelName = modelname_username[0]
    Username = modelname_username[1]
    print("query model name is: ", modelName)
    print("query user is: ", Username)
    # TODO: 你需要把这段代码替换掉，换成搜索后和model绑定的那些datasets
    # 注意：我只需要三个属性： FileName, BriefInfo, UserName。 具体参考以下json文件
    returndata=db.models.find_one({"UserName":Username,"FileName":modelName},{"_id":0})
    data=json.loads(dumps(returndata))
    Array=data["data"]
    firstline=Array[0]
    del Array[0]
    data["data"]=Array
    print("This is testing query")
    Modelinfo=firstline.split(" ")
    colunm_num=Modelinfo[0]
    map_col=Modelinfo[2]
    map_row=Modelinfo[3]
    Modelinfomation={"vectorDim":int(Modelinfo[0]),"xDim":int(Modelinfo[2]),"yDim":int(Modelinfo[3])}
    data.update({"Model_info":Modelinfomation})
    print(data["uuid"])
    uuidofmodel=str(data["uuid"])
    js=list(db.files.find({"UserName":Username,"uuid":uuidofmodel},
                          {"AttrInfo":0,"_id":0,"Keywords":0,"uuid":0,"data":0,
                           "Description":0,"Source":0,"Label":0,
                           "Number_of_Attribute":0,"Number_of_Instance":0}))

    if (len(js) != 0):
        json_data = dumps(js, indent=2)
        with open('./correspondingdatasets.json', 'w') as file:
            file.write(json_data)
        jsonFile = open('./correspondingdatasets.json', 'r')
        values = json.load(jsonFile)
        value=list(values)
        value.insert(0,data)
        values = dumps(value, indent=2)
        with open('./bindedDatasets2.json','w') as f:
         f.write(values)
        return values
    else:
        returndata = db.models.find_one({"UserName": Username, "FileName": modelName}, {"_id": 0})
        data = json.loads(dumps(returndata))
        Array = data["data"]
        firstline = Array[0]
        del Array[0]
        data["data"] = Array
        print("This is testing query")
        Modelinfo = firstline.split(" ")
        colunm_num = Modelinfo[0]
        map_col = Modelinfo[2]
        map_row = Modelinfo[3]
        Modelinfomation={"vectorDim":int(Modelinfo[0]),"xDim":int(Modelinfo[2]),"yDim":int(Modelinfo[3])}
        data.update({"Model_info": Modelinfomation})
        X=[]
        X.insert(0,data)
        value2=dumps(X,indent=2)
        print("This model not have any datasets")
        with open('./bindedDatasets2.json','w') as f:
         f.write(value2)
        return value2

@app.route('/get-umatrixDatasets', methods=["POST"])
@cross_origin()
def query_umatrix_datasets():
    modelname_username = request.get_json(force=True)
    modelName = modelname_username[0]
    Username = modelname_username[1]
    print("the selected model name is: ", modelName)
    print("the user is: ", Username)
    # TODO: 你需要把这段代码替换掉，换成搜索后和model绑定的那些datasets
    # 注意：我只需要三个属性： FileName, BriefInfo, UserName。 具体参考以下json文件
    returndata=db.models.find_one({"UserName":Username,"FileName":modelName},{"_id":0})
    data=json.loads(dumps(returndata))
    Array=data["data"]
    firstline=Array[0]
    del Array[0]
    data["data"]=Array
    print("This is testing query")
    Modelinfo=firstline.split(" ")
    colunm_num=Modelinfo[0]
    map_col=Modelinfo[2]
    map_row=Modelinfo[3]
    Modelinfomation={"vectorDim":int(Modelinfo[0]),"xDim":int(Modelinfo[2]),"yDim":int(Modelinfo[3])}
    data.update({"Model_info":Modelinfomation})
    print(data["uuid"])
    uuidofmodel=str(data["uuid"])
    js=list(db.files.find({"UserName":Username,"uuid":uuidofmodel},
                          {"AttrInfo":0,"_id":0,"Keywords":0,"uuid":0,"data":0,
                           "Description":0,"Source":0,"Label":0,
                           "Number_of_Attribute":0,"Number_of_Instance":0}))

    if (len(js) != 0):
        json_data = dumps(js, indent=2)
        with open('./correspondingdatasets.json', 'w') as file:
            file.write(json_data)
        jsonFile = open('./correspondingdatasets.json', 'r')
        values = json.load(jsonFile)
        value=list(values)
        value.insert(0,data)
        values = dumps(value, indent=2)
        with open('./bindedDatasets2.json','w') as f:
         f.write(values)
        return values
    else:
        returndata = db.models.find_one({"UserName": Username, "FileName": modelName}, {"_id": 0})
        data = json.loads(dumps(returndata))
        Array = data["data"]
        firstline = Array[0]
        del Array[0]
        data["data"] = Array
        print("This is testing query")
        Modelinfo = firstline.split(" ")
        colunm_num = Modelinfo[0]
        map_col = Modelinfo[2]
        map_row = Modelinfo[3]
        Modelinfomation={"vectorDim":int(Modelinfo[0]),"xDim":int(Modelinfo[2]),"yDim":int(Modelinfo[3])}
        data.update({"Model_info": Modelinfomation})
        X=[]
        X.insert(0,data)
        value2=dumps(X,indent=2)
        print("This model not have any datasets")
        with open('./bindedDatasets2.json','w') as f:
         f.write(value2)
        return value2

@app.route('/delete-bindeddataset', methods=["POST"])
@cross_origin()
def delete_binded_datasets():
    dataset_userName = request.get_json(force=True)
    datasetName= dataset_userName[0]
    userName = dataset_userName[1]
    print(userName)

    # to get the selected dataset name from the frontend
    print(datasetName) # you can check the gotten dataset name
    print(type(datasetName))  # string
    # TODO delete the corresponding dataset in the MongoDB based on the datasetName
    # delete corresponding dataset
    db.files.delete_one({"UserName": userName, "FileName": datasetName})
    print("Done the delete")
    # this return must be string, which will be returned to the frontend immediately
    # so DO NOT modify the return 'metadata_string'
    return datasetName


@app.route('/alldatasetFiles', methods=["GET"])
def showAlldatasetFiles():
    if request.method == "GET":
        # read datasets JSON file
        # TODO: You should get the same format of (_id, FileName, Size) from MongoDB, then replace it
        # TODO: return a empty [] to me if there is no file in the MongoDB
        # with open('./all_datasets.json') as f:
        #     data = json.load(f)
        datas = db.files.find({},{'FileName':1,'Description':1,'UserName':1,'_id':0}).sort("UserName", 1)
        datas = dumps(datas, indent = 2)
        print(datas)
        with open('./all_datasets.json','w') as f:
            f.write(datas)
        with open('./all_datasets.json','r') as f:
            data = json.load(f)
        
    return json.dumps(data)

@app.route('/allmodels', methods=["GET", "POST"])
def showAllModels():
    if request.method == "GET":
        # read datasets JSON file
        # TODO: You should get the same format of (_id, FileName, Size) from MongoDB, then replace it
        # TODO: return a empty [] to me if there is no file in the MongoDB
       
      
        data_return = list(db.models.find({},{'data':0}).sort("UserName", 1))

        if (len(data_return) != 0):
            json_data = dumps(data_return, indent=2)
            values = json.loads(json_data)
            values = dumps(values, indent=2)
            print(values)
            return values
        else:
            print("Does not have any file")
            data = []
            return json.dumps(data)

# to query datasets based on the dataset name or key words
@app.route('/query-all-datasets', methods=["POST"])
@cross_origin()
def queryAllDatasets():

    # you will recieve a inputted word by a user from the frontend
    input_value = request.get_json(force=True)
    print(input_value) # you can check the inputted word through this
    print(type(input_value))  # string
    onesearch = []  # one search result
    onesearch2 = []
    List = []  # two-dimensional array
    List2 = []
    if '&&' in input_value:
        inputarray = str(input_value).split("&&")
        for element in inputarray:
            data_return = list(db.files.find({"$and": [
                                                       {"$or": [{"BriefInfo": {"$regex": element, "$options": "$i"}},
                                                                {"Label": {"$regex": element, "$options": "$i"}},
                                                                {"FileName": {"$regex": element, "$options": "$i"}},
                                                                {"Description": {"$regex": element, "$options": "$i"}},
                                                                {"Source": {"$regex": element, "$options": "$i"}},
                                                                {"Keywords": {"$regex": element, "$options": "$i"}},
                                                                {"AttrInfo": {"$regex": element, "$options": "$i"}}]}]},
                                             {"_id": 0}))
            data = loads(dumps(data_return))
            lenth = len(data)
            for i in range(lenth):
                onesearch.append(data[i]['FileName'])
                onesearch2.append(data[i]['UserName'])
            List.append(onesearch)
            List2.append(onesearch2)
            onesearch = []
            onesearch2 = []
        print("XXXXX")
        print(List)
        if len(List) > 1:
            result = List[0]
            result2 = []
            for i in range(1, len(List)):
                result = list(set(result).intersection(set(List[i])))
                result2 += List2[i]
                print(result)

        elif len(List) == 1:
            result = List[0]
            result2 = List2[0]
        else:
            result = []

    elif '||' in input_value:
        inputarray = str(input_value).split("||")
        for element in inputarray:
            data_return = list(db.files.find({"$and": [
                                                       {"$or": [{"BriefInfo": {"$regex": element, "$options": "$i"}},
                                                                {"Label": {"$regex": element, "$options": "$i"}},
                                                                {"FileName": {"$regex": element, "$options": "$i"}},
                                                                {"Description": {"$regex": element, "$options": "$i"}},
                                                                {"Source": {"$regex": element, "$options": "$i"}},
                                                                {"Keywords": {"$regex": element, "$options": "$i"}},
                                                                {"AttrInfo": {"$regex": element, "$options": "$i"}}]}]},
                                             {"_id": 0}))
            data = loads(dumps(data_return))
            lenth = len(data)
            for i in range(lenth):
                onesearch.append(data[i]['FileName'])
                onesearch2.append(data[i]['UserName'])
            List.append(onesearch)
            List2.append(onesearch2)
            onesearch = []
            onesearch2 = []
        print("XXXXX")
        print(List)
        result = List[0]
        result2 = List2[0]
        for onerow in List:
            result = list(set(result).union(set(onerow)))
            print(result)
        for onerow in List2:
            result2 = list(set(result2).union(set(onerow)))
            print(result2)
    else:
        data_return = list(db.files.find({"$and": [
                                                   {"$or": [{"BriefInfo": {"$regex": input_value, "$options": "$i"}},
                                                            {"Label": {"$regex": input_value, "$options": "$i"}},
                                                            {"FileName": {"$regex": input_value, "$options": "$i"}},
                                                            {"Description": {"$regex": input_value, "$options": "$i"}},
                                                            {"Source": {"$regex": input_value, "$options": "$i"}},
                                                            {"Keywords": {"$regex": input_value, "$options": "$i"}},
                                                            {"AttrInfo": {"$regex": input_value, "$options": "$i"}}]}]},
                                         {"_id": 0}))
        data = loads(dumps(data_return))
        lenth = len(data)
        result = []
        result2 = []
        for i in range(lenth):
            result.append(data[i]['FileName'])
            result2.append(data[i]['UserName'])

    print("-----------")
    print(result)
    print(result2)
    data_return = list(db.files.find({"UserName":{"$in": result2}, "FileName": {"$in": result}}, {"_id": 0}))
    if (len(data_return) != 0):
        json_data = dumps(data_return, indent=2)
        with open('./queryResultsForALLDatasets.json', 'w') as file:
            file.write(json_data)
        jsonFile = open('./queryResultsForALLDatasets.json', 'r')
        values = json.load(jsonFile)
        values = dumps(values, indent=2)
        with open('./queryResultsForALLDatasets.json', 'w') as file:
            file.write(values)
        return values
    else:
        print("The user does not have any file")
        data = []
    return json.dumps(loads(dumps(data)))


# to query datasets based on the dataset name or key words
@app.route('/query-all-models', methods=["POST"])
@cross_origin()
def queryAllModels():
    # you will recieve a inputted word by a user from the frontend
    print("helllooo")
    input_value = request.get_json(force=True)
    print(input_value) # you can check the inputted word through this
    print(type(input_value))  # string
    onesearch = []  # one search result
    onesearch2 = []
    List = []  # two-dimensional array
    List2 = []
    if '&&' in input_value:
        inputarray = str(input_value).split("&&")
        for element in inputarray:
            data_return = list(db.models.find({"$and": [
            {"$or": [{"BriefInfo": {"$regex": element, "$options": "$i"}},
            {"FileName": {"$regex": element, "$options": "$i"}}]}]},{"_id": 0}))
            data = loads(dumps(data_return))
            lenth = len(data)
            for i in range(lenth):
                onesearch.append(data[i]['FileName'])
                onesearch2.append(data[i]['UserName'])
            List.append(onesearch)
            List2.append(onesearch2)
            onesearch = []
            onesearch2 = []
        print("XXXXX")
        print(List)
        if len(List) > 1:
            result = List[0]
            result2 = []
            for i in range(1, len(List)):
                result = list(set(result).intersection(set(List[i])))
                result2 += List2[i]
                print(result)
        elif len(List) == 1:
            result = List[0]
            result2 = List2[0]
        else:
            result = []

    elif '||' in input_value:
        inputarray = str(input_value).split("||")
        for element in inputarray:
            data_return = list(db.models.find({"$and": [
            {"$or": [{"BriefInfo": {"$regex": element, "$options": "$i"}},
            {"FileName": {"$regex": element,"$options": "$i"}}]}]}, {"_id": 0}))
            data = loads(dumps(data_return))
            lenth = len(data)
            for i in range(lenth):
                onesearch.append(data[i]['FileName'])
                onesearch2.append(data[i]['UserName'])
            List.append(onesearch)
            List2.append(onesearch2)
            onesearch = []
            onesearch2 = []
        print("XXXXX")
        print(List)
        result = List[0]
        result2 = List2[0]
        for onerow in List:
            result = list(set(result).union(set(onerow)))
            print(result)
        for onerow in List2:
            result2 = list(set(result2).union(set(onerow)))
            print(result2)
    else:
        data_return = list(db.models.find({"$and": [
        {"$or": [{"BriefInfo": {"$regex": input_value, "$options": "$i"}},
        {"FileName": {"$regex": input_value, "$options": "$i"}}]}]},{"_id": 0}))
        data = loads(dumps(data_return))
        lenth = len(data)
        result = []
        result2 = []
        for i in range(lenth):
            result.append(data[i]['FileName'])
            result2.append(data[i]['UserName'])
    print("-----------")
    print(result)
    print(result2)
    data_return = list(db.models.find({"UserName": {"$in": result2}, "FileName": {"$in": result}}, {"_id": 0}))
    if (len(data_return) != 0):
        json_data = dumps(data_return, indent=2)
        with open('./queryResultsForALLModels.json', 'w') as file:
            file.write(json_data)
        jsonFile = open('./queryResultsForALLModels.json', 'r')
        values = json.load(jsonFile)
        values = dumps(values, indent=2)
        with open('./queryResultsForALLModels.json', 'w') as file:
            file.write(values)
        return values
    else:
        print("The user does not have any file")
        data = []
    return json.dumps(data)


if __name__ == "__main__":
    #sess = Session()
    #sess.init_app(app)
    app.run(debug=True)
