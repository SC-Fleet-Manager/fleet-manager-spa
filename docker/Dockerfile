FROM httpd:2.4 as build_apache

ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data

COPY docker/apache/httpd.conf /usr/local/apache2/conf/httpd.conf

WORKDIR /app

USER root
