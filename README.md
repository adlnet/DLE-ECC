# DLE-ECC
A lot of these images rely on ecc-base-python image (registry.il2.dso.mil/adl-ousd/ecc/ecc-base-python-image).  This is a custom image based on IronBank's pythonv3 base image(registry1.dso.mil/ironbank/opensource/python:v3.13), that installs xmlsec1, libxml2, pango (for Python), and the psql client v14 on top of it.

For security purposes, this image can not be shared with the broader community, but government organizations may be able to request access to this image from Platform One.

## Installing Python-Packages
Because this was built for a PartyBus deployment, the following code must be run in the root directory before you can build some systems:
```
python3 -m venv .cache/python-packages
.cache/python-packages/bin/pip install -r requirements.txt --target ".cache/python-packages"
```

## Installing node packages
Because this was built for a PartyBus deployment, the following code must be run in the root directory before you can build some systems:
```
npm install
```

*Note*: This project was designed to run in a specific DevSecOps environment, and may require additional changes before being viable in a new one.  It is also currently tied to CaSS for competency information. 
