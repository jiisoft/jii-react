'use strict';

const Jii = require('jii');
const React = require('react');
const ReactView = require('jii-react/ReactView');

class DetailView extends ReactView {

    render() {
        return (
            <table className='table table-striped table-bordered'>
                <tbody>
                {this.props.model.attributes().map((attribute, index) => {
                    let value = this.props.model.get(attribute);

                    if(Jii.app.hasComponent('formatter') && this.props.model.isAttributeBoolean(attribute)){
                        value = Jii.app.formatter.asBoolean(value);
                    }

                    return (
                        <tr key={index}>
                            <th>{attribute}</th>
                            <td>{value}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        );
    }
}

DetailView.defaultProps = {
    model: null
};

module.exports = DetailView;