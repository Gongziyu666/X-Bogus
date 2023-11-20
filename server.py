import json
import ffmpeg

from flask import Flask, request, jsonify
import execjs    
import urllib.parse

app = Flask(__name__)

@app.route('/X-Bogus', methods=['POST'])
def generate_request_params():
    data = request.get_json()
    url = data.get('url')
    user_agent = data.get('user_agent')
    query = urllib.parse.urlparse(url).query
    xbogus = execjs.compile(open('./X-Bogus.js').read()).call('sign', query, user_agent)
    new_url = url + "&X-Bogus=" + xbogus
    response_data = {
        "param": new_url,
        "X-Bogus": xbogus
    }
    return jsonify(response_data)

@app.route('/xhs-getxs', methods=['POST'])
def xhs_get_xs():
    data = request.get_json()
    api = data.get('api')
    a1 = data.get('a1')
    data = data.get('data')
    if data is None:
        data = ''
    else:
        data = json.dumps(data, separators=(',', ':'))
    ret = execjs.compile(open('xhs_xs.js').read()).call('get_xs', api, data, a1)
    xs = ret['X-s']
    xt = str(ret['X-t'])
    response_data = {
        "xs": xs,
        "xt": xt
    }
    return jsonify(response_data)

@app.route('/xhs-get-auth', methods=['POST'])
def xhs_get_auth():
    data = request.get_json()
    response_data = {
        "auth": execjs.compile(open('xhs_auth.js').read()).call('getAuth', data)
    }
    return jsonify(response_data)

@app.route('/get-video-info', methods=['POST'])
def get_video_info():
    data = request.get_json()
    path = data.get('path')
    # 使用ffmpeg.probe来获取视频文件的元数据
    probe = ffmpeg.probe(path)

    # 将元数据转换为JSON格式
    return json.dumps(probe, indent=4)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8889)

