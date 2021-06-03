#!/bin/sh

srcDir=$1
appName=$2
packageName=$3
version=$4
thirdDir=$5

pack_app(){
  srcDir=$1
  appName=$2
  packageName=$3
  version=$4
  name=$packageName-$version
  npm i
  npm run build -prod

  echo "Packaging $srcDir"
  mkdir -p  $appName/
  ls $srcDir/*.*
  cp -a $srcDir/*.* $appName/
  set -e
  cd "$appName"
  tar -czvf ../"$name.tar.gz" *
  set +e
}
pack_third(){
  thirdDir=$1
  appName=$2
  packageName=$3
  version=$4
  name=$packageName-3rdparty-centos7-$version

  echo "Packaging $thirdDir"
  cd -
  rm -rf $appName
  mkdir $appName
  cp -a $thirdDir/*/*.so* $appName/
  cp -a $thirdDir/log4cxx/log4cxx.properties $appName/

  set -e
  cd "$appName"
  tar -czvf ../"$name.tar.gz" *
  set +e
}
pack_app "$srcDir" "$appName" "$packageName" "$version"

if [ -n "$thirdDir" ]; then
  pack_third "$thirdDir" "$appName" "$packageName" "$version"
fi
