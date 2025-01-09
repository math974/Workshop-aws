import pymysql
import json
import os

# Configuration de la base de données
db_config = {
    "host": os.environ['DB_HOST'],  # Endpoint de votre RDS
    "user": os.environ['DB_USER'],  # Nom d'utilisateur RDS
    "password": os.environ['DB_PASSWORD'],  # Mot de passe RDS
    "database": os.environ['DB_NAME'],  # Nom de la base de données
}

def lambda_handler(event, context):

    print("DB_HOST:", os.getenv('DB_HOST'))
    print("DB_USER:", os.getenv('DB_USER'))
    print("DB_PASSWORD:", os.getenv('DB_PASSWORD'))
    print("DB_NAME:", os.getenv('DB_NAME'))
    connection = pymysql.connect(
        host=db_config['host'],
        user=db_config['user'],
        password=db_config['password'],
        database=db_config['database']
    )
    try:
        http_method = event['httpMethod']
        body = json.loads(event.get('body', '{}'))
        response = {}

        if http_method == 'POST':
            # Créer un enregistrement
            with connection.cursor() as cursor:
                sql = "INSERT INTO users (name, email) VALUES (%s, %s)"
                cursor.execute(sql, (body['name'], body['email']))
            connection.commit()
            response = {"message": "Record created successfully"}

        elif http_method == 'GET':
            # Lire les enregistrements
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM users")
                rows = cursor.fetchall()
            response = {"data": rows}

        elif http_method == 'PUT':
            # Mettre à jour un enregistrement
            with connection.cursor() as cursor:
                sql = "UPDATE users SET name=%s, email=%s WHERE id=%s"
                cursor.execute(sql, (body['name'], body['email'], body['id']))
            connection.commit()
            response = {"message": "Record updated successfully"}

        elif http_method == 'DELETE':
            # Supprimer un enregistrement
            with connection.cursor() as cursor:
                sql = "DELETE FROM users WHERE id=%s"
                cursor.execute(sql, (body['id'],))
            connection.commit()
            response = {"message": "Record deleted successfully"}

        else:
            response = {"message": "Unsupported HTTP method"}

        return {
            "statusCode": 200,
            "body": json.dumps(response)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }

    finally:
        connection.close()
