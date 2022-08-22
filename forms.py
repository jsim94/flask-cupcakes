
from flask_wtf import FlaskForm
from wtforms import StringField, URLField, FloatField
from wtforms.validators import InputRequired, NumberRange


class AddCupcake(FlaskForm):

    flavor = StringField("Flavor", validators=[InputRequired()])
    size = StringField('Size', validators=[InputRequired()])
    rating = FloatField('Rating', validators=[
                        InputRequired(), NumberRange(min=1, max=5)])
    image = URLField('Image URL')
