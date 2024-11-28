import re
def validate(data):
    response ={}
    response["status"] = "True"
    #validar nombre
    if("firstname" in data):
        if not(re.match("^[a-zA-ZáéíóúÁÉÍÓÚ ]+$", data["firstname"])and len(data["firstname"])<=30):
            response["err_name"]="Nombre no valido"
            response["status"]="False"
    
    #Validar segundo nombre
    if("secondname" in data):
        if not(re.match("^[a-zA-ZáéíóúÁÉÍÓÚ ]+$", data["secondname"])and len(data["secondname"])<=30):
            response["err_segname"]="Segundo nombre no valido"
            response["status"]="False"

    #Validar apellidos
    if("lastsnames" in data):
        if not(re.match("^[a-zA-ZáéíóúÁÉÍÓÚ ]+$", data["lastsnames"])and len(data["lastsnames"])<=60):
            response["err_apellido"]="Segundo nombre no valido"
            response["status"]="False"
    
    #validar mail
    if ("email" in data):
        if not (re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', data["email"])):
            response["err_mail"]="Correo no valido"
            response["status"]="False"
    
    #validar el telefono
    if("phone" in data):
        if (len(data["phone"])<10):
            response["err_tel"]="El valor debe ser un número no mayor de 10 digitos"
            response["status"]="False"
    return response
def transform(data):
    datos = {}
    
    if "typeid" in data:
        datos["typeid"] = data["typeid"]
    if "id" in data:
        datos["id"] = data["id"]
    if "firstname" in data:
        datos["firstname"] = data["firstname"]
    if "secondname" in data:
        datos["secondname"] = data["secondname"]
    if "lastsnames" in data:
        datos["lastsnames"] = data["lastsnames"]
    if "birthdate" in data:
        datos["birthdate"] = data["birthdate"]
    if "gender" in data:
        datos["gender"] = data["gender"]
    if "email" in data:
        datos["email"] = data["email"]
    if "phone" in data:
        datos["phone"] = data["phone"]
    if "foto" in data:
        datos["foto"] = data["foto"]
    
    return datos

