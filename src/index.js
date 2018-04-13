import $ from 'jquery';


class Base {
}

class HelloWorld extends Base {
    hello() {
        console.log('Hello boy!');
        return this;
    }
}

$(() => {
    (new HelloWorld()).hello();
});