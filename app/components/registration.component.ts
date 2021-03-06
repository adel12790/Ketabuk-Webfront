import { Component, Input } from '@angular/core';
import { User } from '../models/user';
import { Journal } from '../models/journal';
import { RegistrationService, RegistrationForm } from '../services/registration.service';
import { SuperAuth } from '../supers/super-auth';
import { Config } from '../config';

@Component(
	{
		selector: 'my-login',
		templateUrl: 'app/templates/registration.component.html?v=' + Config.APP_VERSION,
		providers: [RegistrationService]
	}
)
export class RegistrationComponent// implements OnInit
{
	@Input() form : RegistrationForm;
	@Input() journalModified: boolean;
	@Input() journalName: string;
	@Input() password: string;
	valid: boolean = false;
	passwordsMatch: boolean = false;
	emailValid: boolean = false;
	response: string;
	errorMessage: any;
	submitted: boolean = false;
	passwordHasCharacters: boolean = false;
	passwordHasNumbers: boolean = false;
	passwordHasSymbols: boolean = false;
	passwordIsMoreThan12: boolean = false;
	regexHasCharacters : RegExp;
	regexHasNumbers : RegExp;
	regexHasSymbols : RegExp;
	regexMoreThan12 : RegExp;
	regexIsEmail : RegExp;

	constructor(private registerationService: RegistrationService)
	{
		this.form = new RegistrationForm;
		this.form.user = new User;
		this.form.user.journal = new Journal;
		this.journalModified = false;
		this.form.user.journal.name = '';
		var hasCharacters = `(?=.*[a-zA-Z|أابتثجحخدذرزسشصضطظعغفقكلمةـنهويىئءأآإؤ])`;
		var hasNumbers = `(?=.*[0-9١٢٣٤٥٦٧٨٩٠])`;
		var hasSymbols = `(?=.*[!@#$%^&*()_+=٪»«،؟؛\\-\`~±§|\\\\\\'\\";:\\/?\\.,\\<\\>{\\}])`;
		var moreThan12 = `.{12}`;
		var isEmail = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
		this.regexHasCharacters = new RegExp(hasCharacters);
		this.regexHasNumbers = new RegExp(hasNumbers);
		this.regexHasSymbols = new RegExp(hasSymbols);
		this.regexMoreThan12 = new RegExp(moreThan12);
		this.regexIsEmail = isEmail;
	}

	validateEmail()
	{
		this.regexIsEmail.test(this.form.email) ? this.emailValid = true : this.emailValid = false;
	}

	setJournalModified($event: any)
	{
		this.journalModified = true;
	}

	setJournalName($event: any)
	{
		this.form.user.journal.name = "كـتـاب " + this.form.user.name;
	}

	validatePassword()
	{
		this.regexHasCharacters.test(this.form.password) ? this.passwordHasCharacters = true : this.passwordHasCharacters = false;
		this.regexHasNumbers.test(this.form.password) ? this.passwordHasNumbers = true : this.passwordHasNumbers = false;
		this.regexHasSymbols.test(this.form.password) ? this.passwordHasSymbols = true : this.passwordHasSymbols = false;
		this.regexMoreThan12.test(this.form.password) ? this.passwordIsMoreThan12 = true : this.passwordIsMoreThan12 = false;
		
		this.comparePasswords();

		// if it's 13+ we don't care about the rest of the criteria.
		if (this.passwordIsMoreThan12){ this.valid = true; return; }

		// Password needs to have atleast two of the three groups
		var counter = 0;

		this.passwordHasCharacters && counter++;
		this.passwordHasNumbers    && counter++;
		this.passwordHasSymbols    && counter++;

		(counter >= 2) ? this.valid = true : this.valid = false;
	}

	comparePasswords()
	{
		if (this.form.password == this.password) { this.passwordsMatch = true; return }
		this.passwordsMatch = false;
	}

	register()
	{
		this.validatePassword();

		if(this.valid && this.passwordsMatch)
		{
			this.registerationService.register(this.form)
				.subscribe(
				response => SuperAuth.login(response),
				error =>  this.errorMessage = <any>error);
			return;
		}
		this.submitted = true;
	}
}