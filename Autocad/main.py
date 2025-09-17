# Web interface using Flask backend
from flask import Flask, render_template, request, send_file, redirect, url_for
import os
from shape_drawer import parse_instruction, draw_shape

app = Flask(__name__)
UPLOAD_FOLDER = 'static/outputs'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        instruction = request.form.get('instruction')
        try:
            command = parse_instruction(instruction)
            filename = 'output.png'
            output_path = os.path.join(UPLOAD_FOLDER, filename)
            draw_shape(command, save_path=output_path)
            return render_template('index.html', image_file=output_path)
        except Exception as e:
            return render_template('index.html', error=str(e))

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
