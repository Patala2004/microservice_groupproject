import json
import time
import pika
from tag_service import tag_post, delete_post_tags
import os
import socket
from tagexceptions import NonRequeueableError

RABBIT_HOST = os.environ["RABBIT_HOST"]
RABBIT_PORT = int(os.environ["RABBIT_PORT"])
QUEUE_NAME = os.environ["RABBIT_QUEUE_NAME"]


def callback(ch, method, properties, body):
    try:
        try:
            data = json.loads(body)
            post_id = data["post_id"]
            delete = data["delete"]
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            raise NonRequeueableError("Invalid queue request.")

        print(f"Processing post_id={post_id}")
        if (delete):
            delete_post_tags(post_id)
        else:
            tag_post(post_id)
        print(f"Finished processing post_id={post_id}")

        ch.basic_ack(delivery_tag=method.delivery_tag)

    except NonRequeueableError as e:
        print("Error: ", e)
        if ch.is_open:
            ch.basic_nack(
                delivery_tag=method.delivery_tag,
                requeue=False
            )

    except Exception as e:
        print("Retryable error:", e)
        if ch.is_open:
            ch.basic_nack(
                delivery_tag=method.delivery_tag,
                requeue=True
            )


def connect():
    delay = 2
    max_delay = 30
    while True:
        try:
            print(f"Connecting to RabbitMQ {RABBIT_HOST}:{RABBIT_PORT}...")

            connection = pika.BlockingConnection(
                pika.ConnectionParameters(
                    host=RABBIT_HOST,
                    port=RABBIT_PORT,
                    credentials=pika.PlainCredentials(
                        "app_user",
                        "supersecret"
                    ),
                    heartbeat=900,
                    blocked_connection_timeout=1200,
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

            print("Connected to RabbitMQ")
            return connection, channel

        except (
            pika.exceptions.AMQPConnectionError,
            socket.gaierror,
            OSError
        ) as e:
            print(f"RabbitMQ not ready ({e}). Retrying in {delay}s...")
            time.sleep(delay)
            delay = min(delay * 2, max_delay)


def main():
    while True:
        try:
            connection, channel = connect()
            print("Waiting for messages...")
            channel.start_consuming()

        except (
            pika.exceptions.AMQPConnectionError,
            socket.gaierror,
            OSError
        ) as e:
            print(f"RabbitMQ connection lost: {e}")
            time.sleep(5)

        except KeyboardInterrupt:
            print("Worker stopped")
            try:
                connection.close()
            except Exception:
                pass
            break


if __name__ == "__main__":
    main()
