describe('Scrubber', function() {
	it('should work', function() {
	})

	describe('.handle', function() {
		it ('should set x & y', function() {
			var scrubber = new Scrubber
			scrubber.handle(50, 100);
			expect(scrubber.x).toBe(null);
			expect(scrubber.y).toBe(null);
			scrubber.handle(55, 105);
			expect(scrubber.x).toBe(5);
			expect(scrubber.y).toBe(5);
			scrubber.handle(null, 115);
			expect(scrubber.x).toBe(5);
			expect(scrubber.y).toBe(15);
		})
	})

	describe('@minY', function() {
		it ('should limit y', function() {
			var scrubber = new Scrubber({minY: 50});
			scrubber.handle(25, 25)
			expect(scrubber.x).toBe(null);
			expect(scrubber.y).toBe(null);
			scrubber.handle(55, 55)
			expect(scrubber.x).toBe(30);
			expect(scrubber.y).toBe(null);
			scrubber.handle(100, 100)
			expect(scrubber.x).toBe(75);
			expect(scrubber.y).toBe(75);
		})
	})

	describe('@maxY', function() {
		it ('should limit y', function() {
			var scrubber = new Scrubber({maxY: 50});
			scrubber.handle(25, 25)
			expect(scrubber.x).toBe(null);
			expect(scrubber.y).toBe(null);
			scrubber.handle(50, 50)
			expect(scrubber.x).toBe(25);
			expect(scrubber.y).toBe(25);
			scrubber.handle(75, 75)
			expect(scrubber.x).toBe(50);
			expect(scrubber.y).toBe(50);
			scrubber.handle(100, 100)
			expect(scrubber.x).toBe(75);
			expect(scrubber.y).toBe(50);
		})
	})


	describe('@minX', function() {
		it ('should limit x', function() {
			var scrubber = new Scrubber({minX: 50});
			scrubber.handle(25, 25)
			expect(scrubber.y).toBe(null);
			expect(scrubber.x).toBe(null);
			scrubber.handle(55, 55)
			expect(scrubber.y).toBe(30);
			expect(scrubber.x).toBe(null);
			scrubber.handle(100, 100)
			expect(scrubber.y).toBe(75);
			expect(scrubber.x).toBe(75);
		})
	})

	describe('@maxX', function() {
		it ('should limit y', function() {
			var scrubber = new Scrubber({maxX: 50});
			scrubber.handle(25, 25)
			expect(scrubber.y).toBe(null);
			expect(scrubber.x).toBe(null);
			scrubber.handle(50, 50)
			expect(scrubber.y).toBe(25);
			expect(scrubber.x).toBe(25);
			scrubber.handle(75, 75)
			expect(scrubber.y).toBe(50);
			expect(scrubber.x).toBe(50);
			scrubber.handle(100, 100)
			expect(scrubber.y).toBe(75);
			expect(scrubber.x).toBe(50);
		})
	})

	describe('@thresholdX', function() {
		it ('should ignore difference lower than the value', function() {
			var scrubber = new Scrubber({thresholdX: 50});
			scrubber.handle(0, 0);
			expect(scrubber.y).toBe(null);
			expect(scrubber.x).toBe(null);
			scrubber.handle(30, 30)
			expect(scrubber.y).toBe(30);
			expect(scrubber.x).toBe(null);
			scrubber.handle(60, 60)
			expect(scrubber.y).toBe(60);
			expect(scrubber.x).toBe(10);
			scrubber.handle(65, 65)
			expect(scrubber.y).toBe(65);
			expect(scrubber.x).toBe(15);
			scrubber.handle(45, 45)
			expect(scrubber.y).toBe(45);
			expect(scrubber.x).toBe(-5);
		})

		it ('should ignore negative difference lower than the value', function() {
			var scrubber = new Scrubber({thresholdX: 50});
			scrubber.handle(0, 0);
			expect(scrubber.y).toBe(null);
			expect(scrubber.x).toBe(null);
			scrubber.handle(-30, -30)
			expect(scrubber.y).toBe(-30);
			expect(scrubber.x).toBe(null);
			scrubber.handle(-60, -60)
			expect(scrubber.y).toBe(-60);
			expect(scrubber.x).toBe(-10);
			scrubber.handle(-65, -65)
			expect(scrubber.y).toBe(-65);
			expect(scrubber.x).toBe(-15);
			scrubber.handle(-45, -45)
			expect(scrubber.y).toBe(-45);
			expect(scrubber.x).toBe(5);
		})
	})

	describe('@thresholdY', function() {
		it ('should ignore difference lower than the value', function() {
			var scrubber = new Scrubber({thresholdY: 50});
			scrubber.handle(0, 0);
			expect(scrubber.x).toBe(null);
			expect(scrubber.y).toBe(null);
			scrubber.handle(30, 30)
			expect(scrubber.x).toBe(30);
			expect(scrubber.y).toBe(null);
			scrubber.handle(60, 60)
			expect(scrubber.x).toBe(60);
			expect(scrubber.y).toBe(10);
			scrubber.handle(65, 65)
			expect(scrubber.x).toBe(65);
			expect(scrubber.y).toBe(15);
			scrubber.handle(45, 45)
			expect(scrubber.x).toBe(45);
			expect(scrubber.y).toBe(-5);
		})

		it ('should ignore negative difference lower than the value', function() {
			var scrubber = new Scrubber({thresholdY: 50});
			scrubber.handle(0, 0);
			expect(scrubber.x).toBe(null);
			expect(scrubber.y).toBe(null);
			scrubber.handle(-30, -30)
			expect(scrubber.x).toBe(-30);
			expect(scrubber.y).toBe(null);
			scrubber.handle(-60, -60)
			expect(scrubber.x).toBe(-60);
			expect(scrubber.y).toBe(-10);
			scrubber.handle(-65, -65)
			expect(scrubber.x).toBe(-65);
			expect(scrubber.y).toBe(-15);
			scrubber.handle(-45, -45)
			expect(scrubber.x).toBe(-45);
			expect(scrubber.y).toBe(5);
		})
	})

	describe('@next', function() {
		it ('should pass overflowing movement to the next scrubber in chain', function() {
			var first = new Scrubber({maxY: 50})
			var second = new Scrubber();
			first.next = second;
			first.handle(10, 10);
			expect(first.x).toBe(null);
			expect(first.y).toBe(null);
			first.handle(40, 40)
			expect(first.x).toBe(30);
			expect(first.y).toBe(30);
			expect(second.x).toBe(null);
			expect(second.y).toBe(null);
			first.handle(100, 100)
			expect(first.x).toBe(90);
			expect(first.y).toBe(50);
			expect(first.overflowX).toBe(0);
			expect(first.overflowY).toBe(40);
			expect(second.x).toBe(null);
			expect(second.y).toBe(40);
			first.handle(120, 120)
			expect(first.x).toBe(110);
			expect(first.y).toBe(50);
			expect(first.overflowX).toBe(0);
			expect(first.overflowY).toBe(60);
			expect(second.x).toBe(null);
			expect(second.y).toBe(60);
		})
	})


	describe('@previous', function() {
		it ('should pass overflowing movement to the next scrubber in chain', function() {
			var first = new Scrubber({minY: -50})
			var second = new Scrubber();
			first.previous = second;
			first.handle(-10, -10);
			expect(first.x).toBe(null);
			expect(first.y).toBe(null);
			first.handle(-40, -40)
			expect(first.x).toBe(-30);
			expect(first.y).toBe(-30);
			expect(second.x).toBe(null);
			expect(second.y).toBe(null);
			first.handle(-100, -100)
			expect(first.x).toBe(-90);
			expect(first.y).toBe(-50);
			expect(first.overflowX).toBe(0);
			expect(first.overflowY).toBe(-40);
			expect(second.x).toBe(null);
			expect(second.y).toBe(-40);
			first.handle(-120, -120)
			expect(first.x).toBe(-110);
			expect(first.y).toBe(-50);
			expect(first.overflowX).toBe(0);
			expect(first.overflowY).toBe(-60);
			expect(second.x).toBe(null);
			expect(second.y).toBe(-60);
		})
	})
})