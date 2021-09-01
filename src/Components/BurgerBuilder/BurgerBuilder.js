import React, { Component } from 'react';
import Burger from './Burger/Burger';
import Controls from './Controls/Controls';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import Summary from './Summary/Summary';
import { connect } from 'react-redux';
import { addIngredient, removeIngredient, updateIngredient, updatePurchaseable } from '../../redux/actionCreators';



const mapStateToProps = state => {
    return {
        ingredients: state.ingredients,
        totalPrice: state.totalPrice,
        purchaseable: state.purchaseable,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addIngredient: (igtype) => dispatch(addIngredient(igtype)),
        removeIngredient: (igtype) => dispatch(removeIngredient(igtype)),
        updatePurchaseable: () => dispatch(updatePurchaseable()),
    }
}






class BurgerBuilder extends Component {

    state = {
        modalOpen: false,
    }


 


    addIngredientHandle = type => {


        this.props.addIngredient(type);
        this.props.updatePurchaseable();
    }

    removeIngredientHandle = (type) => {
        this.props.removeIngredient(type);
        this.props.updatePurchaseable();
    }

    toggleModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen
        })
    }



    handelCheckout = () => {
        this.props.history.push('/checkout'); //this works to route to the checkout page ...very very important
    }



    render() {
        return (
            <div>
                <div className='d-flex flex-md-row flex-column'>
                    <Burger ingredients={this.props.ingredients} />
                    <Controls
                        ingredientAdded={this.addIngredientHandle}
                        ingredientRemoved={this.removeIngredientHandle}
                        price={this.props.totalPrice}
                        toggleModal={this.toggleModal}
                        purchaseable={this.props.purchaseable} />
                </div>
                <Modal isOpen={this.state.modalOpen}>
                    <ModalBody>
                        <h5>Total Price: {this.props.totalPrice.toFixed(0)} BDT</h5>
                        <Summary ingredients={this.props.ingredients} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.handelCheckout} style={{backgroundColor: '#D70F64'}}>Continue to Checkout</Button>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>

        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(BurgerBuilder);