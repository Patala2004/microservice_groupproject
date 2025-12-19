#!/bin/bash
set -e

rabbitmq-server -detached
rabbitmqctl wait /var/lib/rabbitmq/mnesia/rabbit@$(hostname).pid

VHOST_INTERACTIONS="/interactions"
rabbitmqctl add_vhost "$VHOST_INTERACTIONS" || echo "Vhost already exists"

rabbitmqctl add_user "upref-user" "uprefpassword" || echo "User exists"
rabbitmqctl set_permissions -p "$VHOST_INTERACTIONS" "upref-user" ".*" ".*" ".*"

rabbitmqctl add_user "apig-user" "apigpassword" || echo "User exists"
rabbitmqctl set_permissions -p "$VHOST_INTERACTIONS" "apig-user" ".*" ".*" "^$"

rabbitmqctl stop
rabbitmq-server
