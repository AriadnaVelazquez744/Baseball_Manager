import requests
import mimetypes


BASE = "http://127.0.0.1:8000//api/queries/export/"

data = {
    "filename": "tabla",
    "format": "pdf",
    "data": {
        "Sección 1": [
            {
                "winner__name": "North Gregory Pan",
                "games_played": 17,
                "total_points_won": 144,
                "total_points_lost": 33
            },
            {
                "winner__name": "North Shawnberg",
                "games_played": 10,
                "total_points_won": 120,
                "total_points_lost": 35
            }
        ],
        "Sección 2": [
            {
                "player_name": "John Doe",
                "matches_played": 8,
                "points_scored": 85
            },
            {
                "player_name": "Jane Smith",
                "matches_played": 12,
                "points_scored": 110
            }
        ],
        "Sección 3": [
            {
                "P_id__P_id__CI": 50269349,
                "P_id__P_id__name": "Aaron",
                "P_id__P_id__age": 63,
                "dominant_hand": "derecha",
                "P_id__years_of_experience": 2,
                "No_games_won": 0,
                "No_games_lost": 0,
                "running_average": 2
            },
            {
                "P_id__P_id__CI": 76695078,
                "P_id__P_id__name": "Patricia",
                "P_id__P_id__age": 68,
                "dominant_hand": "izquierda",
                "P_id__years_of_experience": 13,
                "No_games_won": 10,
                "No_games_lost": 14,
                "running_average": 4
            },
            {
                "P_id__P_id__CI": 29384768,
                "P_id__P_id__name": "Shannon",
                "P_id__P_id__age": 52,
                "dominant_hand": "derecha",
                "P_id__years_of_experience": 18,
                "No_games_won": 0,
                "No_games_lost": 0,
                "running_average": 3
            },
            {
                "P_id__P_id__CI": 61074511,
                "P_id__P_id__name": "Mark",
                "P_id__P_id__age": 58,
                "dominant_hand": "izquierda",
                "P_id__years_of_experience": 12,
                "No_games_won": 12,
                "No_games_lost": 12,
                "running_average": 4
            }
        ],
        "Sección 4": [
            {
                "winner__name": "North Gregory Pan",
                "games_played": 17,
                "total_points_won": 144,
                "total_points_lost": 33
            },
            {
                "winner__name": "North Shawnberg",
                "games_played": 10,
                "total_points_won": 120,
                "total_points_lost": 35
            }
        ],
        "Sección 5": [
            {
                "player_name": "John Doe",
                "matches_played": 8,
                "points_scored": 85
            },
            {
                "player_name": "Jane Smith",
                "matches_played": 12,
                "points_scored": 110
            }
        ]
    }
}

# Hacer la solicitud POST
response = requests.post("http://127.0.0.1:8000//api/queries/export/", json=data)

# Verificar que la respuesta sea exitosa
if response.status_code == 200:
    # Obtener el Content-Type de la respuesta
    content_type = response.headers.get("Content-Type", "")
    
    # Determinar la extensión del archivo basada en el Content-Type
    extension = mimetypes.guess_extension(content_type) or ".bin"  # .bin como predeterminado para casos desconocidos

    # Nombrar el archivo de salida con la extensión adecuada
    output_file = f"output{extension}"
    
    # Guardar el contenido en un archivo
    with open(output_file, "wb") as file:
        file.write(response.content)
    
    print(f"El archivo se ha descargado correctamente como '{output_file}'.")
else:
    print(f"Error al generar el archivo. Código de estado: {response.status_code}")
    print("Detalle:", response.text)
