import json
import pika
import os

RABBIT_HOST = os.environ["RABBIT_HOST"]
RABBIT_PORT = int(os.environ["RABBIT_PORT"])
QUEUE_NAME = os.environ["RABBIT_QUEUE_NAME"]
EXCHANGE = os.environ["RABBIT_EXCHANGE"]
ROUTING_KEY = os.environ["RABBIT_ROUTING_KEY"]


def publish_to_rabbit(post_id, delete):
    connection = pika.BlockingConnection(
        pika.ConnectionParameters(
            host=RABBIT_HOST,
            port=RABBIT_PORT,
            credentials=pika.PlainCredentials(
                "app_user",
                "supersecret"
            )
        )
    )
    channel = connection.channel()

    channel.queue_declare(
        queue=QUEUE_NAME,
        durable=True,
        passive=True
    )

    message = {
        "post_id": post_id,
        "delete": delete
    }

    channel.basic_publish(
        exchange=EXCHANGE,
        routing_key=ROUTING_KEY,
        body=json.dumps(message),
        properties=pika.BasicProperties(
            delivery_mode=2
        )
    )

    connection.close()
