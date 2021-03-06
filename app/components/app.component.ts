import { Component, OnInit } from '@angular/core';
import { SuperAuth } from '../supers/super-auth';
import { Config } from '../config';
import { Journal } from '../models/journal';
import { User } from '../models/user';

import '../rxjs-operators';

@Component({
	selector: 'my-app',
	templateUrl: 'app/templates/app.component.html?v=' + Config.APP_VERSION,
	providers: [ SuperAuth ],
})
export class AppComponent implements OnInit
{
	private m_isLoggedIn : boolean;
	private myJournalLink : string;
	private journal : Journal;
	private user : User;

	ngOnInit()
	{
		this.isLoggedIn();
		if(this.m_isLoggedIn)
			this.setUser();
	}

	isLoggedIn()
	{
		this.m_isLoggedIn = SuperAuth.isLoggedIn();
	}

	logout()
	{
		SuperAuth.logout();
	}

	setUser()
	{
		this.user = SuperAuth.getAuthenticatedUser();
	}
}