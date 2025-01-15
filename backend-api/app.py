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
    headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type"
    }

    if event['httpMethod'] == 'OPTIONS':
        return {
            "statusCode": 200,
            "headers": headers,
            "body": ""
        }

    connection = pymysql.connect(
        host=db_config['host'],
        user=db_config['user'],
        password=db_config['password'],
        database=db_config['database']
    )

    try:
        http_method = event['httpMethod']
        response = {}

        body = json.loads(event.get('body', '{}')) if http_method != 'GET' else {}
        print(f"Body querie: {body}")

        if http_method == 'POST':
            with connection.cursor() as cursor:
                sql = "INSERT INTO users (name, email) VALUES (%s, %s)"
                cursor.execute(sql, (body['name'], body['email']))
            connection.commit()
            response = {"message": "Record created successfully"}

        elif http_method == 'GET':
            with connection.cursor() as cursor:
                cursor.execute("SELECT * FROM users")
                rows = cursor.fetchall()
            response = {"data": rows}

        elif http_method == 'PUT':
            
            with connection.cursor() as cursor:
                sql = "UPDATE users SET name=%s, email=%s WHERE id=%s"
                cursor.execute(sql, (body['name'], body['email'], body['id']))
            connection.commit()
            response = {"message": "Record updated successfully"}

        elif http_method == 'DELETE':
            with connection.cursor() as cursor:
                sql = "DELETE FROM users WHERE id=%s"
                cursor.execute(sql, (body['id'],))
            connection.commit()
            response = {"message": "Record deleted successfully"}

        else:
            response = {"message": "Unsupported HTTP method"}

        return {
            "statusCode": 200,
            "headers": headers,
            "body": json.dumps(response)
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "headers": headers,
            "body": json.dumps({"error": str(e)})
        }

    finally:
        connection.close()
