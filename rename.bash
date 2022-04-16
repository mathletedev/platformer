for file in public/assets/$1/*
do
	mv "$file" "public/assets/$1/${file#public/assets/$1/pixil-frame-}"
done
