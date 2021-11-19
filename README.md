# Atmosphere

Installing FOSS / OSS and software on the cloud should be easier. Tools exist, cloud providers exist, yet you need technical knowledge or someone to guide you trough the process. Atmosphere attempts to close the gap doing cross-compatible-cloud installations. 

Behind the scenes we use Terraform, which sets the base to speak with multiple cloud providers.

## Site

You can try the site at [Atmosphere](https://atmosphere.innovare.es)

## Contributing

The repositories for the software is located at [`github`](https://github.com/innovare-atmosphere/).

Frontend code is done with React with Next.js & tailwindscss.
Interaction layer with terraform is done in FastAPI.
Database interaction is done with pydal, the default database is Posgresql.

## Provider organization

Every provider is a repository with at least the following:

1. LICENSE, for the terraform scripts. Our provided scripts, all are Free Software AGPL 3.0.
2. A README.md file with detailed information about the provided software
3. A group of folders, each folder is for installing the same software on different cloud infrastructures, currently the supported ones are:
    - taco-digitalocean
    - digitalocean

## Provider Metadata

Every provider we test and include generates basic metadata, that metadata is important because it allows adding specific data for the users in atmosphere platform.