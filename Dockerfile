
FROM fusuf/whatsasena:latest

# set timezone
ENV TZ=Asia/Kolkata
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# clone the repo and change workdir
RUN git clone https://github.com/maxsupun/UltraMax.git /root/UltraMax/
WORKDIR /root/UltraMax/

# install main requirements.
RUN pip3 install --no-cache-dir -r requirements.txt
RUN pip3 uninstall av -y && pip3 install av --no-binary av
RUN npm install supervisor -g
RUN yarn install --no-audit

# start the bot
CMD ["bash", "resources/startup/startup.sh"]
