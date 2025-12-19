FROM rabbitmq:3-management

COPY init-users.sh /init-users.sh
RUN chmod +x /init-users.sh

CMD ["/init-users.sh"]
