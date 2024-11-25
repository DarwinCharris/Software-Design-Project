
import requests, re

'''url = "https://fa-rd-lfaria.azurewebsites.net/api/getperson"

response = requests.get(url, params={"id": "12346"})
if response.content == b'User not found':
    print("Todo bien")
else:
    print("todo mal")

'''
def validate(data):
    response={}
    #Si todas las validaciones están bien dejar en True
    response["status"]="True"
    print(len(data["id"]))
    #ID
    if not(data["id"].isdigit()):
        response["id"]="El valor debe ser númerico"
        response["status"]="False"
    elif (len(data["id"])<10):
        response["id"]="El valor debe ser un número no mayor de 10 digitos"
        response["status"]="False"
    #Nombre
    if not(re.match("^[a-zA-ZáéíóúÁÉÍÓÚ ]+$", data["name"])and len(data["name"])<=30):
        response["name"]="Nombre no valido"
        response["status"]="False"
    #Segundo Nombre
    if not(re.match("^[a-zA-ZáéíóúÁÉÍÓÚ ]+$", data["segname"])and len(data["segname"])<=30):
        response["segname"]="Segundo nombre no valido"
        response["status"]="False"
    #Apellido
    if not(re.match("^[a-zA-ZáéíóúÁÉÍÓÚ ]+$", data["apellido"])and len(data["apellido"])<=60):
        response["apellido"]="Segundo nombre no valido"
        response["status"]="False"
    #Correo
    if not (re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', data["mail"])):
        response["mail"]="Correo no valido"
        response["status"]="False"
    #Celular
    if not(data["tel"].isdigit()):
        response["tel"]="El valor debe ser númerico"
        response["status"]="False"
    elif (len(data["tel"])<10):
        response["tel"]="El valor debe ser un número no mayor de 10 digitos"
        response["status"]="False"
    #Foto
    if not "foto" in data:
        response["foto"]="Proporcionar una foto"
        response["status"]="False"
    return response

def parse_data(data):
    res={}
    res["typeid"]=data["tipo"]
    res["id"]=data["id"]
    res["firstname"]=data["name"]
    res["secondname"]=data["segname"]
    res["lastsnames"]=data["apellido"]
    res["birthdate"]=data["fecha"]
    res["gender"]=data["genero"]
    res["email"]=data["mail"]
    res["phone"]=data["tel"]
    return res
