#!/bin/sh

echo
echo Burn Baby Burn compilation script
echo -- marcel@q42.nl
echo

echo Removing old build files..
rm -rf build
mkdir build

#Copy images
echo "Copying images..."
cp -R img build > /dev/null
cp -R audio build > /dev/null

#CSS & JS minification
function compile {
  echo "Compiling $1.."
  fn="hmh.$1"
  out="build/$fn"
  for file in $2
  do
    cat "./$file">>$fn
  done
  if [ $1 == "css" ]
    then
      java -jar lib/yuicompressor-2.4.8.jar --type css -o $out $fn
  fi
  if [ $1 == "js" ]
    then
      java -jar lib/compiler.jar --language_in ECMASCRIPT5 --js $fn --js_output_file $out
  fi
  rm $fn
}

css=`sed 's/.*<link rel=\"stylesheet\".*href=\"\(.*\)\".*/\1/p;d' index.html`
js=`sed 's/.*<script type=\"text\/javascript\" .*src=\"\(.*\)\".*/\1/p;d' index.html`

compile css "$css"
compile js "$js"

#Point HTML references to compiled files
out="build/index.html"
cat index.html|grep -v "<link rel=\"stylesheet\""|egrep -v "<script type=\"text\/javascript\".*" > $out
sed "s/<!-- css -->/<link rel=\"stylesheet\" type=\"text\/css\" href=\"hmh.css\" \/>/g" $out > tmp1.tmp
sed "s/<!-- js -->/<script type=\"text\/javascript\" src=\"hmh.js\"><\/script>/g" tmp1.tmp > tmp2.tmp
mv tmp2.tmp $out
rm tmp1.tmp

echo
echo Done!
echo
