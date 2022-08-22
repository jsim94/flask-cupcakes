"""Flask app for Cupcakes"""
from flask import Flask, render_template, request, jsonify
from models import db, connect_db, Cupcake
from forms import AddCupcake

app = Flask(__name__)
app.config['SECRET_KEY'] = 'asddwaadw12azcz'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True

connect_db(app)
db.create_all()


@app.route('/')
def home_route():
    return render_template('home.html', form=AddCupcake())


@app.route('/api/cupcakes')
def return_all_cupcakes():
    cupcakes = Cupcake.serialize_all()
    return jsonify(cupcakes=cupcakes)


@app.route('/api/cupcakes', methods=['POST'])
def new_cupcake():

    json = request.json

    flavor = json.get('flavor')
    size = json.get('size')
    rating = json.get('rating')
    if bool(json.get('image')):
        image = json.get('image')

    image = json.get('image') if bool(json.get('image')) else None

    new_cupcake = Cupcake(flavor=flavor, size=size,
                          rating=float(rating), image=image)
    db.session.add(new_cupcake)
    db.session.commit()

    return (jsonify(cupcake=new_cupcake.serialize()), 201)


@app.route('/api/cupcakes/<cupcake_id>')
def return_cupcake(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    return jsonify(cupcake=cupcake.serialize())


@app.route('/api/cupcakes/<cupcake_id>', methods=['PATCH'])
def update_cupcake(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)

    json = request.json

    cupcake.flavor = json.get('flavor')
    cupcake.size = json.get('size')
    cupcake.rating = json.get('rating')
    if bool(json.get('image')):
        cupcake.image = json.get('image')

    db.session.add(cupcake)
    db.session.commit()

    return jsonify(cupcake=cupcake.serialize())


@app.route('/api/cupcakes/<cupcake_id>', methods=['DELETE'])
def delete_cupcake(cupcake_id):
    cupcake = Cupcake.query.get_or_404(cupcake_id)
    db.session.delete(cupcake)
    db.session.commit()

    return jsonify(message="Deleted")
