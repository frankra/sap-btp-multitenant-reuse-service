#!/bin/bash
cf create-service postgresql-db trial postgresql &&
cf create-service xsuaa broker xsuaa -c '{
  "xsappname": "xsuaa",
  "tenant-mode": "shared",
  "scopes": [
    {
      "name": "$XSAPPNAME.Callback",
      "description": "With this scope set, the callbacks for tenant onboarding, offboarding and getDependencies can be called.",
      "grant-as-authority-to-apps": [
        "$XSAPPNAME(application,sap-provisioning,tenant-onboarding)"
      ]
    }
  ]
}' &&
cf create-service saas-registry application saas-registry -c '{
    "xsappname": "xsuaa",
    "appName": "multitenant-product-reuse-service",
    "displayName": "Multitenant Product Service",
    "description": "Testing Multitenant Reuse Service",
    "category": "Test Application",
    "appUrls": {
        "getDependencies": "https://30db1073trial-multitenant-product-approuter.cfapps.eu10.hana.ondemand.com/callback/v1.0/dependencies",
        "onSubscription": "https://30db1073trial-multitenant-product-approuter.cfapps.eu10.hana.ondemand.com/callback/v1.0/tenants/{tenantId}",
        "onSubscriptionAsync": false,
        "onUnSubscriptionAsync": false,
        "callbackTimeoutMillis": 300000
    }
}'