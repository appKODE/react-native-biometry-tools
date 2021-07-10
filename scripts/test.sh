#!/bin/bash
# update version & create changelog via standard-version, create release notes for version

# GitLab environment variables:
# $GITLAB_ACCESS_TOKEN
# $GITLAB_REPOSITORY
# $GITLAB_USER_EMAIL
# $GITLAB_USER_NAME
# $GITLAB_PROJECT_NAME
# $GITLAB_PROJECT_ID
# $ISSUE_URL_FORMAT

# remember home directory
HOME_DIRECTORY=$(echo $PWD)

# configure gitlab user
git remote set-url origin https://gitlab-ci-token:$GITLAB_ACCESS_TOKEN@$GITLAB_REPOSITORY.git
git config --global user.email $GITLAB_USER_EMAIL
git config --global user.name $GITLAB_USER_NAME

# delete common "release" tag
git push --delete origin release
git tag -d release

# delete common "update-version" tag
git push --delete origin update-version
git tag -d update-version

# move to /tmp and clone repo
cd /tmp
git clone https://gitlab-ci-token:$GITLAB_ACCESS_TOKEN@$GITLAB_REPOSITORY.git
cd $GITLAB_PROJECT_NAME

$(yarn install)

cd node_modules/react-native-biometry-tools
ls
