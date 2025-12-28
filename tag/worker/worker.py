import json
import pika
from tag_service import tag_post
import os

RABBIT_HOST = os.environ["RABBIT_HOST"]
RABBIT_PORT = int(os.environ["RABBIT_PORT"])
QUEUE_NAME = os.environ["RABBIT_QUEUE_NAME"]


def callback(ch, method, properties, body):
    try:
        data = json.loads(body)
        post_id = data["post_id"]

        print(f"Processing post_id={post_id}")
        tag_post(post_id)

        ch.basic_ack(delivery_tag=method.delivery_tag)

    except Exception as e:
        print("Error:", e)
        # puedes reenviar, mandar a DLQ, o no hacer ACK
        ch.basic_nack(
            delivery_tag=method.delivery_tag,
            requeue=False  # o True si quieres reintentos
        )


def main():
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

    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(
        queue=QUEUE_NAME,
        on_message_callback=callback,
        auto_ack=False
    )

    print("Waiting for messages...")
    channel.start_consuming()


if __name__ == "__main__":
    main()
