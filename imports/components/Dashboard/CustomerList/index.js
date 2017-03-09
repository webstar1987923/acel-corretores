import React, {Component, PropTypes} from 'react';
import {browserHistory} from 'react-router';
import Card from './Card';
import Table from './Table';
import GroupDropdown from '../GroupManager/GroupDropdown';
import './style.scss';

class CustomerList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			customers: this.props.customers,
			keyword: this.props.keyword,
			listStyle: this.props.listStyle,
			currentPage: 1,
			selectedCustomers: [],
			currentCustomerAction: false,
			editable: false,
			movable: false
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			customers: nextProps.customers,
			keyword: nextProps.keyword,
			listStyle: nextProps.listStyle,
			currentPage: nextProps.currentPage
		})
	}

	_handleClickCustomer(customer) {
		const { editable } = this.state;

		console.log('_handleClickCustomer', customer, editable);
		if (editable)
			return this._selectCustomer(customer._id);

		if(this.props.handleClick) {
			console.log('props handleClick')
			this.props.handleClick(customer);
		}
		else {
			console.log('go to profile')
			//browserHistory.push(`/summary-profile/${customer._id}/`);
		}
	}

	_handleClickMovable() {
		this.setState({
			movable: !this.state.movable
		});
	}

	_customersSelectable() {
		this.setState({
			selectedCustomers: [],
			editable: !this.state.editable
		});
	}

	_selectCustomer(customer) {
		if(!customer) {
			this.setState({
				selectedCustomers: [],
				editable: false,
			})
		}
		else {
			let selectedCustomers = this.state.selectedCustomers;
			const isSelected = selectedCustomers.find((c) => c == customer);
			if(isSelected) {
				selectedCustomers = _.reject(selectedCustomers, (c) => c == isSelected);
			}
			else {
				selectedCustomers.push(customer)
			}

			this.setState({
				selectedCustomers
			})
		}
	}

	_selectAllCustomer() {
		const { customers } = this.props;
		// const costumersIds = this.state.currentGroup.isDefault
		// 	? this.props.customers.filter((c) => !c.groupId).map((c) => c._id)
		// 	: this.props.customers.filter((c) => c.groupId == this.state.currentGroup._id).map((c) => c._id);
		const costumersIds = customers.map((c) => c._id);
		this.setState({
			selectedCustomers: (costumersIds.length != this.state.selectedCustomers.length) ? costumersIds : []
		})
	}
	
	_renderList(customers, type) {
		const { selectedCustomers, editable } = this.state;
		const { groups } = this.props;
		const _isSelected = (costumerId) => selectedCustomers.find((c) => c == costumerId);

		switch(type) {
			case 'card':
				const listCard = customers.map(customer =>
					<Card
						customer={customer}
						key={customer._id}
						selected={_isSelected(customer._id)}
						handleClick={this._handleClickCustomer.bind(this, customer)}
						groups={groups}
					/>);
					return (
						<div className={`cards-clients row ${editable && 'editable'}`}>
							{listCard}
						</div>
					);
				break;
			case 'table':
				const listTable = customers.map(customer =>
					<Table
						customer={customer}
						key={customer._id}
						selected={_isSelected(customer._id)}
						handleClick={this._handleClickCustomer.bind(this, customer)}
						groups={groups}
					/>);
				return (
					<table className="table table-hover">
						<thead>
						<tr>
							<th>Nome</th>
							<th></th>
							<th>Origem</th>
							<th>Produtos já adquiridos</th>
						</tr>
						</thead>
						<tbody>
						{listTable}
						</tbody>
					</table>
				);
				break;
		}
	}

	_renderActionBar() {
		const { selectedCustomers, editable, movable } = this.state;
		const { groups } = this.props;

		if(editable) {
			if (!selectedCustomers.length) {
				return (
					<div className="action-bar border-content div-content-fot footer-color">
						<div className="buttons-status">
							<div onClick={this._selectCustomer.bind(this, '')}>
								<i className="fa fa-remove icons-arv"
									 aria-hidden="true"/>
							</div>
							<div>
								Selecione um contato
							</div>
						</div>
						<div className="content-buttons"></div>
					</div>
				);
			}
			else {
				return (
					<div className="action-bar border-content div-content-fot footer-color">
						<div className="buttons-status">
							<div onClick={this._selectCustomer.bind(this, '')}>
								<i className="fa fa-remove icons-arv"
									 aria-hidden="true"/>
							</div>
							<div>
								{selectedCustomers.length} contatos selecionados
							</div>
						</div>
						<div className="content-buttons">
							<div>
								<button type="button" className="btn btn-arv" onClick={this._selectAllCustomer.bind(this)}>
									<i className="fa fa-bars icons-arv" aria-hidden="true"/>
									Selecionar tudo
								</button>
							</div>

							{movable &&
							<GroupDropdown
								groups={groups}
								selectedCustomers={selectedCustomers}
								alignClass="top left">
							</GroupDropdown>}
							{movable &&
							<div className="overlay"
									 onClick={this._handleClickMovable.bind(this)}/>}

							<div>
								<button
									className="dropdown-toggle btn btn-arv"
									type="button"
									onClick={this._handleClickMovable.bind(this)}>
									<i className="fa fa-pencil icons-arv"
										 aria-hidden="true"/>
										Mover
									<span className="caret" style={{marginLeft: '10px'}}/>
								</button>
							</div>
						</div>
					</div>
				)
			}
		}

		return(
			<div className="action-bar row border-content div-content-fot footer-color">
				<div className="col-md-12">
					<div className="content-buttons">
						{/*<div>*/}
							{/*<button type="button" className="btn btn-arv" data-toggle="modal" data-target="#modalBase">*/}
								{/*<i className="fa fa-cloud-upload icons-arv" aria-hidden="true"/>*/}
								{/*Upload de Base*/}
							{/*</button>*/}
						{/*</div>*/}
						{/*<div>*/}
							{/*<button type="button" className="btn btn-arv">*/}
								{/*<i className="fa fa-plus icons-arv" aria-hidden="true"/>*/}
								{/*Adicionar Contatos*/}
							{/*</button>*/}
						{/*</div>*/}
						<div>
							<button
								type="button"
								className="btn btn-arv"
								onClick={this._customersSelectable.bind(this)}>
									<i className="fa fa-pencil icons-arv"
										 aria-hidden="true"/>
								Editar
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	render() {
		const {
			customers,
			keyword,
			currentPage,
			listStyle
		} = this.state;
		const { limit, groups } = this.props;

		const filteredCustomers = (keyword.length ? customers.filter(
			(c) => (c.name || c.customerName).toLowerCase().includes(keyword.toLowerCase())
		) : customers).slice(0, (currentPage * limit || customers.length));

		return (
			<div className={`list-container col-md-12`}>
				{this._renderList(filteredCustomers, listStyle)}
				{groups && this._renderActionBar()}
			</div>
		);
	}
}

CustomerList.defaultProps = {
	listStyle: 'card',
	keyword: '',
	limit: 10,
	currentPage: 1
};

CustomerList.protoTypes = {
	customers: PropTypes.object.isRequired,		//Customers raw information
	limit: PropTypes.number, 									//Customer Show Limit per load
	listStyle: PropTypes.string, 							//List Style: Card / Table
	keyword: PropTypes.string, 								//OPTIONAL: Filter Keyword
	currentPage: PropTypes.number, 						//Current List Page (Current: 10 cards/lines per page)
	handleClick: PropTypes.func, 							//OPTIONAL: HandleClick single Card / Table
	groups: PropTypes.array 									//OPTIONAL: Dropdown Groups (Movable) FIXME: Groups direto no dropdown
};

export default CustomerList;
