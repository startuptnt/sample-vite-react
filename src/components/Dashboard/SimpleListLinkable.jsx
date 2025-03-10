import React from 'react';
import PropTypes from 'prop-types';
import { ListContextProvider, useListContext } from 'react-admin';
import { Link } from 'react-router-dom';
import { Avatar, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const SimpleListLinkable = ({ rowClick, primaryText, secondaryText, tertiaryText, leftAvatar, leftIcon, rightAvatar, rightIcon, ...props }) => {
    const { data, isLoading, total } = useListContext();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <ListContextProvider value={{ data, isLoading, total }}>
            {data.map(record => (
                <Link to={rowClick(record)} key={record.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItem button>
                        {leftAvatar && (
                            <ListItemAvatar>
                                <Avatar>{leftAvatar(record)}</Avatar>
                            </ListItemAvatar>
                        )}
                        {leftIcon && (
                            <ListItemAvatar>
                                <IconButton>{leftIcon(record)}</IconButton>
                            </ListItemAvatar>
                        )}
                        <ListItemText
                            primary={(
                                <div>
                                    {primaryText(record)}
                                    { tertiaryText && (
                                        <span className={SimpleListClasses.tertiary} style={{ float: 'right', opacity: 0.6 }}>
                                            {tertiaryText(record)}
                                        </span>
                                    )}
                                </div>
                            )}
                            secondary={ (
                                secondaryText && secondaryText(record)
                            )}
                        />
                        {rightAvatar && (
                            <ListItemAvatar>
                                <Avatar>{rightAvatar(record)}</Avatar>
                            </ListItemAvatar>
                        )}
                        {rightIcon && (
                            <ListItemSecondaryAction>
                                <IconButton edge="end">{rightIcon(record)}</IconButton>
                            </ListItemSecondaryAction>
                        )}
                    </ListItem>
                </Link>
            ))}
        </ListContextProvider>
    );
};

SimpleListLinkable.propTypes = {
    rowClick: PropTypes.func,
    primaryText: PropTypes.func.isRequired,
    secondaryText: PropTypes.func,
    tertiaryText: PropTypes.func,
    leftAvatar: PropTypes.func,
    leftIcon: PropTypes.func,
    rightAvatar: PropTypes.func,
    rightIcon: PropTypes.func,
};

const PREFIX = 'RaSimpleList';

const SimpleListClasses = {
    tertiary: `${PREFIX}-tertiary`,
};

export default SimpleListLinkable;