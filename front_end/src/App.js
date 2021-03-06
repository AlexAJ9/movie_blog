import { connect } from 'react-redux';
import React, { useState, useEffect } from 'react'
import { Container, Button, Menu } from 'semantic-ui-react'
import { BrowserRouter as Router, Route, Link, Redirect, withRouter } from 'react-router-dom'

import Login from './components/login'
import List from './components/dataList'
import Form from './components/dataForm'
import Item from './components/singleItem'
import Profile from './components/profile'
import Register from './components/register'
import UpdateForm from './components/updateForm'
import Notification from './components/notification'

import dataService from './services/dataService'

import { initAll } from './reducers/dataReducer'
import { userData, userLogOut } from './reducers/loginReducer'

import './components/style.css'

const App = (props) => {

    const [user, setUser] = useState(null)
    const [activeItem, setActiveItem] = useState('home')

    const logOut = () => setUser(null)
    const matchId = (id) => props.data.find(x => x.id === id.toString())
    const handleItemClick = (e, { name }) => setActiveItem(name)

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedappUser')
        if (loggedUserJSON) {
            const currentUser = JSON.parse(loggedUserJSON)
            setUser(JSON.parse(loggedUserJSON))
            dataService.setToken(currentUser.token)
        }
    }, [props])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedappUser')
        if (loggedUserJSON) {
            const currentUser = JSON.parse(loggedUserJSON)
            setUser(JSON.parse(loggedUserJSON))
            dataService.setToken(currentUser.token)
            props.userData(JSON.parse(loggedUserJSON))
        }
    }, [])

    useEffect(() => {
        props.initAll()
    }, [])

    const handleLogoOut = (e) => {
        e.preventDefault()
        window.localStorage.clear()
        props.userLogOut()
        logOut()
    }

    const Nav = () => {
        return (
            <Menu size='large'>
                <Menu.Item name='home' as={Link} to='/' active={activeItem === 'home'} onClick={handleItemClick} />
                <Menu.Item name='create' as={Link} to='/create' active={activeItem === 'create'} onClick={handleItemClick} />
                <Menu.Item name='profile' as={Link} to='/profile' active={activeItem === 'profile'} onClick={handleItemClick} />
                <Menu.Menu position='right'>
                    <Menu.Item>
                        <form onSubmit={handleLogoOut}><Button type='submit' primary> Sign out</Button></form>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }

    return (
        <Container>
            <Router>
                {user ? Nav() : <Redirect to='/login' />}
                <Route path='/register' render={() => <Register />} />
                <Route exact path='/' render={() => <List />} />
                <Route path='/profile' render={() => <Profile />} />
                <Route path='/login' render={() => user === null ? <Login /> : <Redirect to='/' />} />
                <Route path='/create' render={() => <Form />} />
                <Route path='/item/:id' render={({ match }) => <Item item={matchId(match.params.id)} />} />
                <Route exact path='/edit/:id' render={({ match }) => <UpdateForm item={matchId(match.params.id)} />} />
                <Notification />
            </Router>
        </Container>
    )
}

const mapStateToProps = (state) => {
    return {
        data: state.data,
        user: state.user,
        notification: state.notification
    }
}

const mapDispatchToProps = {
    initAll,
    userLogOut,
    userData
}

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)
export default ConnectedApp

// TO DO : FIX ROUTER BUGSS/ CSS / UI RESPONSIVE / MESSAGES / Fix ratings 