import React, {Component, PropTypes} from 'react';
import GroupDropdown from '../GroupManager/GroupDropdown';

class Card extends Component {
	constructor(props) {
		super(props);

		this.state = {
			active: false,
			selected: false
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			selected: nextProps.selected
		})
	}

	_handleClickActions() {
		this.setState({
			selected: !this.state.selected
		})
	}

	_getProductIcon(type, key = 0) {
		switch(type) {
			case 'conecta':
				return <i key={key} className="fa fa-car" aria-hidden="true" title="Conecta"/>;
				break;
			case 'seguro-auto':
				return <i key={key} className="fa fa-car" aria-hidden="true" title="Seguro-Auto"/>;
				break;
			case 'carro-facil':
				return <i key={key} className="fa fa-car" aria-hidden="true" title="Carro Fácil"/>;
				break;
			case 'alarme-mais':
				return <i key={key} className="fa fa-car" aria-hidden="true" title="Alarme-Mais"/>;
				break;
			case 'Apartamento':
				return <i key={key} className="fa fa-car" aria-hidden="true" title="Apartamento"/>;
				break;
			case 'casa':
				return <i key={key} className="fa fa-car" aria-hidden="true" title="Casa"/>;
				break;
			case 'Veículo':
				return <i key={key} data-toggle="tooltip" className="fa fa-car" aria-hidden="true" title="Veículo"/>;
				break;
			default:
				return <i key={key} data-toggle="tooltip" className="fa fa-car" aria-hidden="true" title="A Fácil"/>;
				break;
		}
	}

	_getSourceIcon(type, key = 0) {
		switch(type) {
			case 'face':
				return <i key={key} className="fa fa-facebook" aria-hidden="true" title="Facebook"/>;
				break;
			case 'linkedin':
				return <i key={key} className="fa fa-linkedin" aria-hidden="true" title="LinkedIn"/>;
				break;
			case 'cloud':
				return <i key={key} className="fa fa fa-cloud" aria-hidden="true" title="Cloud"/>;
				break;
			default:
				return <i key={key} className="fa fa fa-cloud" aria-hidden="true" title="Cloud"/>;
				break;
		}
	}

	render() {
		const { customer, groups } = this.props;
		const { selected, active } = this.state;
		const fullName = [(customer.name || ''), (customer.customerName || ''), (customer.surname || '')].join(" ").trim().split(" ");
		const firstName = fullName.shift();
		const lastName = fullName.pop();
		const avatarStyle = customer.avatar ? {backgroundImage: `url(${customer.avatar})`} : {};

		return (
			<div className="Card__container col-md-3"
					 key={customer._id}>
				<div className={`card ${(selected && 'selected')}`}>
					<div className="header-card">
						{groups &&
						<div className={`actions ${(active && 'active')}`}>
							<i className={`icon-actions fa fa-ellipsis-v ${(active && 'hidden')}`}
								 onClick={this._handleClickActions.bind(this)}/>
							{selected &&
							<GroupDropdown
								groups={groups}
								selectedCustomers={customer._id}>
							</GroupDropdown>}
							{selected && 
							<div className="overlay"
									 onClick={this._handleClickActions.bind(this)}/>}
						</div>
						}
						<div className="icon-base">
							{this._getSourceIcon((customer.originId || customer.source))}
						</div>
						<div className="customer-avatar"
								 style={avatarStyle}
								 onClick={this.props.handleClick}/>
						<h2 onClick={this.props.handleClick}>
							{`${firstName} ${(lastName != undefined && lastName != firstName) ? lastName : ''}`}
						</h2>
					</div>
					<div className="info-card">
						<div className="col-md-12">
							<div className="pull-left">
								<p>
									<span>Produtos: {customer.acquiredProducts && customer.acquiredProducts.length || 0}</span>
								</p>
								<div className="icons-prod">
									{customer.acquiredProducts && customer.acquiredProducts.map((p, k) => this._getProductIcon(p, k))}
								</div>
							</div>

							{customer.potencial &&
							<div className="pull-right">
								<p>
									<span>Potencial: 0</span>
								</p>
								<div className="icons-prod">
									<i data-toggle="tooltip" title="" className="fa fa-credit-card-alt" aria-hidden="true"
										 data-original-title="Cartão"/>
									<i data-toggle="tooltip" title="" className="fa fa-car" aria-hidden="true"
										 data-original-title="Auto"/>
								</div>
							</div>}
						</div>
					</div>
				</div>
			</div>
		)
	}
}

Card.defaultProps = {
	selected: false
}

Card.protoTypes = {
	customer: PropTypes.object.isRequired,	//Current Customer
	products: PropTypes.array,							//TEMP: acquiredProducts
	handleClick: PropTypes.func,						//Customer Click callback
	groups: PropTypes.array 								//TEMP: Dropdown groups
};

export default Card;
