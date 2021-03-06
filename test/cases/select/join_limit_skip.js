describe("join with limit & skip", function () {
    it('inner join & limit', function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "inner",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                }
            },
            limit: 10
        }).then(function (results) {
            expect(results).to.be.an('array').length(10);
            var firstValue = results[0];
            expect(firstValue).to.be.an('object').to.haveOwnProperty('orderId').equal(10248);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('inner join & skip', function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "inner",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                }
            },
            skip: 10
        }).then(function (results) {
            expect(results).to.be.an('array').length(186);
            var firstValue = results[0];
            expect(firstValue).to.be.an('object').to.haveOwnProperty('orderId').equal(10258);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    it('inner join & limit & skip', function (done) {
        con.select({
            from: "Orders",
            join: {
                with: "Customers",
                type: "inner",
                on: "Orders.customerId=Customers.customerId",
                as: {
                    customerName: "name",
                    contactName: "cName",
                    customerId: "cId"
                }
            },
            limit: 10,
            skip: 5
        }).then(function (results) {
            expect(results).to.be.an('array').length(10);
            var firstValue = results[0];
            expect(firstValue).to.be.an('object').to.haveOwnProperty('orderId').equal(10253);
            done();
        }).catch(function (err) {
            done(err);
        })
    });

    
});