import React, {Component, PropTypes} from 'react';
import { createContainer } from 'meteor/react-meteor-data';
//import { BarChart, Bar } from 'recharts';
import { Link } from 'react-router';
import './style.scss';

class ProductsPanel extends Component {

	constructor(props) {
		super(props);
	}

	//Products
	renderProductsHeader() {
		return (
			<div className="div-content-produtos-header">
				<h1>Objetivos mensais de venda</h1>
			</div>
		);
	}

	_getProductColor(nome) {
		switch(nome) {
			case 'carro-facil':
				return 'graph-produto--carrofacil';
				break;
			case 'alarme-mais':
				return 'graph-produto--alarme';
				break;
			case 'seguro-auto':
				return 'graph-produto--conecta';
				break;
		}
	}

	renderProductsItens() {
		return (
			<div className="ProductsPanel__container div-content-produtos-itens">
				<div className="row">
					{this.props.productsList.map((product, key) => {
						const currentGraphValue = 100 - ((product.actualGoal * 100) / product.monthlyGoal);

						return (
							<div className={"col-md-4 produtos-item graph-border-bottom"}
									 key={key}>
								<h2 id="product-name-desc">{product.name}</h2>
								<div>
									<p>
										<span><b>{product.actualGoal}</b></span>/{product.monthlyGoal}
									</p>

									<Link className={`graph-produto ${this._getProductColor(product.systemName)}`}
												to={`/quotation-list/${product.systemName}`}>
										<img
											key={"graph-produto-img-" + product._id}
											className="graph-produto-img"
											src={GLOBAL.images.mapProductImages[product.systemName]}
										/>
										<div className="graph-valor graph-alarme"
												 style={{height: `${currentGraphValue}%`}}/>

										<div className="donut-inner">
											<span className="graph-title">Ver Clientes potenciais <i className="fa fa-chevron-right" aria-hidden="true"/></span>
										</div>
									</Link>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		);
	}

	renderProductsContent() {
		return (
			<div className="div-content-produtos">
				{ this.renderProductsHeader() }
				{ this.renderProductsItens() }
			</div>
		);
	}

	render() {
		return (this.renderProductsContent());
	}
}

export default createContainer((props) => {

	const productsHandle = Meteor.subscribe('products.all');
	const productsList = Products.find().fetch().reverse();

	return {
		...props,
		productsList,
		loading: !productsHandle.ready(),
		user: Meteor.user()
	}
}, ProductsPanel);
