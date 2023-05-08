[![Deploy and update (pre release)](https://github.com/innovare-atmosphere/atmosphere/actions/workflows/actions-dev.yml/badge.svg)](https://github.com/innovare-atmosphere/atmosphere/actions/workflows/actions-dev.yml)

[![Deploy and update (release)](https://github.com/innovare-atmosphere/atmosphere/actions/workflows/actions-prod.yml/badge.svg)](https://github.com/innovare-atmosphere/atmosphere/actions/workflows/actions-prod.yml)

# Atmosphere

Installing FOSS / OSS and software on the cloud should be easier. Tools exist, cloud providers exist, yet you need technical knowledge or someone to guide you trough the process. Atmosphere attempts to close the gap doing installations easier. 

Try it here: You can try it at [atmosphere.innovare.es](https://atmosphere.innovare.es)

## Development

Behind the scenes we use Terraform, which sets the base to speak with multiple cloud providers.

Currently Innovare-Atmosphere uses digitalocean to provide the installation of virtually any open source solution that can be installed with a Terraform configuration.

There is a set of Terraform configurations that have been tested, you can check them out in our repository list:

https://github.com/innovare-atmosphere

## Installation (development)

TODO: Insert current state and more details here

## Contributing

The repositories for the software are located at [`github.com/innovare-atmosphere`](https://github.com/innovare-atmosphere/).

Frontend code is done with React with Next.js & tailwindscss.
Interaction layer with terraform is done in FastAPI.
Database interaction is done with pydal, the default database is Posgresql.

TODO: Insert more dev docs
