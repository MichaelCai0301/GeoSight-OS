# coding=utf-8
"""
GeoSight is UNICEF's geospatial web-based business intelligence platform.

Contact : geosight-no-reply@unicef.org

.. note:: This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation; either version 3 of the License, or
    (at your option) any later version.

"""
__author__ = 'irwan@kartoza.com'
__date__ = '02/05/2024'
__copyright__ = ('Copyright 2023, Unicef')

from django.apps import AppConfig


class Config(AppConfig):
    """Documentation app."""

    label = 'geosight_tenants'
    name = 'geosight.tenants'
    verbose_name = "GeoSight Tenant"


default_app_config = 'geosight.tenants.Config'
