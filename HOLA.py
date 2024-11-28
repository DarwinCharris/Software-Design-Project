import requests

url = "https://fa-lg-lfaria.azurewebsites.net/api/querylogs"
data = {
}


response = requests.post(url, data=data)

print(response.text)