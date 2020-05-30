mkdir -p ./bin/

while [ 1 ]
do
    mkdir -p ./staging
    git clone https://github.com/hdt80/topt.git ./staging

    cp ./staging/index.html ./bin/index.html
    cp ./staging/index.js ./bin/index.js
    cp ./staging/server.py ./bin/server.py
    rm -rf ./staging/

    cd ./bin/

    python ./server.py &
    SERVER_PID=$!

    sleep 300

    kill $SERVER_PID

    cd ..
done
